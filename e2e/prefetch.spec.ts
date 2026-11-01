import { expect, test } from "@playwright/test";

const EN_PAGES = ["/en/pricing", "/en/about", "/en/work"];
const MAX_REQUESTS_PER_URL = 3;

test.use({ viewport: { width: 1440, height: 900 } });

for (const path of EN_PAGES) {
  test(`${path} settles without a prefetch loop`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(2000);
    const counts = new Map<string, number>();
    page.on("request", (request) => {
      counts.set(request.url(), (counts.get(request.url()) ?? 0) + 1);
    });
    await page.reload();
    await page.waitForLoadState("networkidle", { timeout: 10_000 });
    await page
      .getByRole("link", { name: "FR", exact: true })
      .first()
      .hover();
    await page.waitForTimeout(3000);
    const repeated = [...counts].filter(
      ([, count]) => count > MAX_REQUESTS_PER_URL,
    );
    expect(repeated).toEqual([]);
  });
}
