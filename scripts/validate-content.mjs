import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const contentRoot = join(root, "src", "content");

function markdownEntries(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: basename(file, ".md"),
      file,
      data: matter(readFileSync(join(directory, file), "utf8")).data,
    }));
}

const errors = [];
const contests = markdownEntries(join(contentRoot, "contests")).filter(
  (entry) => !entry.data.draft,
);
const currentContests = contests.filter(
  (contest) => contest.data.kind === "current",
);

if (currentContests.length !== 1) {
  errors.push(
    `현재 대회는 정확히 1개여야 합니다. 현재 ${currentContests.length}개입니다.`,
  );
}

const seasonKeys = new Set();
const editions = new Set();

for (const contest of contests) {
  const seasonKey = `${contest.data.year}-${contest.data.season}`;
  if (seasonKeys.has(seasonKey))
    errors.push(`중복된 대회 시즌입니다: ${seasonKey}`);
  seasonKeys.add(seasonKey);

  if (!Number.isInteger(contest.data.edition) || contest.data.edition < 1) {
    errors.push(`${contest.file}의 공개 대회에는 1 이상의 회차가 필요합니다.`);
  } else {
    if (editions.has(contest.data.edition))
      errors.push(`중복된 대회 회차입니다: ${contest.data.edition}`);
    editions.add(contest.data.edition);
  }

  if (contest.slug !== seasonKey) {
    errors.push(
      `${contest.file}의 파일명은 ${seasonKey}.md 형식이어야 합니다.`,
    );
  }
}

const firstContest = contests.find((contest) => contest.data.edition === 1);
if (
  !firstContest ||
  firstContest.data.year !== 2026 ||
  firstContest.data.season !== "fall"
) {
  errors.push("제1회 공식 대회는 2026-fall이어야 합니다.");
} else if (firstContest.data.slogan !== "Detect, Think, Solve,") {
  errors.push("제1회 공식 대회 표어를 확인하세요.");
}

const memberSlugs = new Set(
  markdownEntries(join(contentRoot, "members"))
    .filter((entry) => !entry.data.draft)
    .map((member) => member.slug),
);
for (const competition of markdownEntries(
  join(contentRoot, "competitions"),
).filter((entry) => !entry.data.draft)) {
  for (const participant of competition.data.participants ?? []) {
    if (!memberSlugs.has(participant)) {
      errors.push(
        `${competition.file}의 참여자 ${participant}에 해당하는 구성원 파일이 필요합니다.`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`콘텐츠 검사 완료: 대회 ${contests.length}개`);
