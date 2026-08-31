import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const httpsUrl = z.string().refine(
  (value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  },
  { message: "HTTPS URL을 입력하세요." },
);

const home = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/home" }),
  schema: z.object({
    title: z.string().min(1),
    slogan: z.string().min(1),
    chapters: z
      .array(
        z.object({
          id: z.enum(["about", "contest", "records", "join"]),
          label: z.string().min(1),
          title: z.string().min(1),
          description: z.string().min(1),
          linkLabel: z.string().min(1),
        }),
      )
      .length(4)
      .refine(
        (chapters) =>
          chapters.map((chapter) => chapter.id).join(",") ===
          "about,contest,records,join",
        { message: "홈 챕터는 about, contest, records, join 순서여야 합니다." },
      ),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/about" }),
  schema: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
    activities: z
      .array(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          linkText: z.string().min(1).optional(),
          linkTo: z.enum(["contest"]).optional(),
        }),
      )
      .length(3),
  }),
});

const join = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/join" }),
  schema: z.object({
    title: z.string().min(1),
    apply: z.object({
      label: z.string().min(1),
      url: httpsUrl.optional(),
      qrImage: z.string().min(1).optional(),
      statusText: z.string().optional(),
    }),
    contact: z.object({
      label: z.string().min(1),
      name: z.string().min(1).optional(),
      email: z.email().optional(),
      statusText: z.string().optional(),
    }),
  }),
});

const studies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/studies" }),
  schema: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
    tracks: z
      .array(
        z.object({
          name: z.enum(["초급반", "중급반"]),
          description: z.string().min(1),
        }),
      )
      .length(2),
  }),
});

const contests = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/contests" }),
  schema: z.object({
    title: z.string().min(1),
    edition: z.number().int().positive().optional(),
    kind: z.enum(["current", "past"]),
    year: z.number().int().min(2026),
    season: z.enum(["spring", "fall"]),
    summary: z.string().min(1),
    schedule: z.string().min(1),
    location: z.string().min(1),
    audience: z.string().min(1),
    format: z.string().min(1),
    rules: z.array(z.string().min(1)).min(1),
    slogan: z.string().optional(),
    result: z.string().optional(),
    images: z.array(z.string().min(1)).optional(),
    draft: z.boolean().default(false),
  }),
});

const members = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/members" }),
  schema: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    email: z.email().optional(),
    intro: z.string().min(1).optional(),
    interests: z.array(z.string().min(1)).min(1).optional(),
    order: z.number().int().nonnegative(),
    github: httpsUrl.optional(),
    avatar: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const competitions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/competitions" }),
  schema: z.object({
    title: z.string().min(1),
    year: z.number().int().min(2000),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    dateEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    summary: z.string().min(1).optional(),
    division: z.string().optional(),
    participants: z.array(z.string().min(1)).optional(),
    result: z.string().optional(),
    link: httpsUrl.optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  home,
  about,
  join,
  studies,
  contests,
  members,
  competitions,
};
