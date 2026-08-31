import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://hanshin-solvers.github.io",
  base: "/homepage",
  output: "static",
  integrations: [sitemap()],
});
