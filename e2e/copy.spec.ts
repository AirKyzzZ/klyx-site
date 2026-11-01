import { expect, test } from "@playwright/test";

import { site } from "../src/lib/site";

const PAGES = [
  "/",
  "/en",
  "/a-propos",
  "/en/about",
  "/cas-usage",
  "/en/use-cases",
  "/cas-usage/immobilier",
  "/en/use-cases/real-estate",
  "/cas-usage/agences",
  "/en/use-cases/agencies",
  "/cas-usage/cabinets-services",
  "/en/use-cases/professional-services",
  "/faq",
  "/en/faq",
];

for (const path of PAGES) {
  test(`${path} shows no pending marker and no SIRET outside the footer`, async ({
    request,
    page,
  }) => {
    const html = await (await request.get(path)).text();
    expect(html).not.toContain("TODO(maxime)");
    await page.goto(path);
    await expect(page.locator("main")).not.toContainText(site.siret);
    await expect(page.locator("footer")).toContainText(site.siret);
  });
}
