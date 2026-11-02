import { expect, test } from "@playwright/test";

import { outreachPaths } from "./route-paths";

const CTA = "Réserver 30 minutes";
const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL;
const MAIN_NAV_HREFS = ["/tarifs", "/realisations", "/a-propos", "/services/"];

test("sitemap and llms.txt leave the outreach pages out", async ({
  request,
}) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const llms = await (await request.get("/llms.txt")).text();
  for (const path of outreachPaths) {
    expect(sitemap).not.toContain(path);
    expect(llms).not.toContain(path);
  }
});

for (const path of outreachPaths) {
  test.describe(path, () => {
    test("renders FR-only, noindex, with one h1 and no hreflang", async ({
      page,
    }) => {
      const response = await page.goto(`${path}?ref=dm&utm_source=linkedin`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", "fr");
      await expect(page.locator("h1")).toHaveCount(1);
      const robots = await page
        .locator('meta[name="robots"]')
        .getAttribute("content");
      expect(robots).toContain("noindex");
      expect(robots).toContain("nofollow");
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://klyx.fr${path}`,
      );
      await expect(page.locator("link[hreflang], a[hreflang]")).toHaveCount(0);
      await expect(page.locator('a[href^="/en"]')).toHaveCount(0);
    });

    test("has no main nav, only the logo and one CTA in the header", async ({
      page,
    }) => {
      await page.goto(path);
      const header = page.locator("header");
      await expect(header.locator("a")).toHaveCount(2);
      await expect(header.locator("nav")).toHaveCount(0);
      for (const href of MAIN_NAV_HREFS) {
        await expect(header.locator(`a[href^="${href}"]`)).toHaveCount(0);
      }
      await expect(page.locator(".view-toggle")).toHaveCount(0);
    });

    test("repeats one CTA pointing to Cal.com or the /contact fallback", async ({
      page,
    }) => {
      await page.goto(path);
      const links = page.getByRole("link", { name: CTA, exact: true });
      expect(await links.count()).toBeGreaterThanOrEqual(3);
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute("href", CAL_URL ?? "/contact");
      }
      const otherCtas = page.getByRole("link", {
        name: /devis|réserver un appel/i,
      });
      await expect(otherCtas).toHaveCount(0);
    });

    test("serves its own 1200x630 OG image", async ({ page, request }) => {
      await page.goto(path);
      const image = await page
        .locator('meta[property="og:image"]')
        .first()
        .getAttribute("content");
      expect(image).toContain(`${path}/opengraph-image`);
      const response = await request.get(
        new URL(image!).pathname + new URL(image!).search,
      );
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toBe("image/png");
      const png = Buffer.from(await response.body());
      expect(png.readUInt32BE(16)).toBe(1200);
      expect(png.readUInt32BE(20)).toBe(630);
    });
  });
}

test("the English prefix does not serve outreach pages", async ({
  request,
}) => {
  for (const path of outreachPaths) {
    const response = await request.get(`/en${path}`);
    expect(response.status()).toBe(404);
  }
});
