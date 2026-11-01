import { readdirSync } from "node:fs";

import { expect, test } from "@playwright/test";

import { HIDDEN_CASE, routePaths } from "./route-paths";

const caseSlugs = [
  ...new Set(
    readdirSync("content/realisations").map((file) => file.split(".")[0]),
  ),
].filter((slug) => slug !== HIDDEN_CASE);

const paths = new Set([
  ...routePaths,
  ...caseSlugs.flatMap((slug) => [`/realisations/${slug}`, `/en/work/${slug}`]),
]);

for (const path of paths) {
  test(`${path} shows no pending marker`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(await response.text(), path).not.toContain("TODO(maxime)");
  });
}
