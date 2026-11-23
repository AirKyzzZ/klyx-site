import { expect, test } from "@playwright/test";

const EN_PAGES = [
  { path: "/en/pricing", fr: "/tarifs" },
  { path: "/en/about", fr: "/a-propos" },
  { path: "/en/work", fr: "/realisations" },
];
const MAX_REQUESTS_PER_URL = 3;
const LOOP_OBSERVATION_MS = 3000;

test.use({ viewport: { width: 1440, height: 900 } });

for (const { path, fr } of EN_PAGES) {
  test(`${path} settles without a prefetch loop`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const counts = new Map<string, number>();
    page.on("request", (request) => {
      counts.set(request.url(), (counts.get(request.url()) ?? 0) + 1);
    });
    await page.reload();
    await page.waitForLoadState("networkidle", { timeout: 10_000 });

    const menu = page.locator("header details").filter({
      has: page.locator("summary", { hasText: "Language" }),
    });
    await menu.locator("summary").click();
    const frLink = menu.locator('a[hreflang="fr"]');
    await expect(frLink).toBeVisible();
    await expect(frLink).toHaveAttribute("href", fr);
    await frLink.hover();
    await page.waitForTimeout(LOOP_OBSERVATION_MS);

    const repeated = [...counts].filter(
      ([, count]) => count > MAX_REQUESTS_PER_URL,
    );
    expect(repeated).toEqual([]);
  });
}
