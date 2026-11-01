import { expect, test } from "@playwright/test";

import { site } from "../src/lib/site";

const PAGES = ["/", "/en", "/a-propos", "/en/about"];

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
