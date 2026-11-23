import { expect, test } from "@playwright/test";

const OFFER_PAGES = [
  "/services/creation-site-web",
  "/services/agents-ia",
  "/forward-deployed-engineer",
  "/services/audit-ia",
  "/services/automatisation-ia",
  "/services/geo-referencement-ia",
  "/en/services/websites",
  "/en/services/ai-agents",
  "/en/forward-deployed-engineer",
  "/en/services/ai-audit",
  "/en/services/ai-automation",
  "/en/services/ai-search-visibility",
];

const PRICE = /\d\s?€|€\s?\d/;

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];

test.use({ reducedMotion: "reduce" });

for (const path of [...OFFER_PAGES, "/tarifs", "/en/pricing"]) {
  for (const viewport of VIEWPORTS) {
    test(`${path} hero shows the h1, the price and both calls to action at ${viewport.width}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      const hero = page.locator('[data-shot="hero"]');
      await expect(hero.locator("h1")).toBeVisible();
      const actions = [
        hero.locator('[data-track="cta_book_call_click"]'),
        hero.locator('[data-track="cta_quote_click"]'),
      ];
      for (const action of actions) {
        await expect(action).toHaveCount(1);
        const box = await action.boundingBox();
        expect(box, path).not.toBeNull();
        expect(box!.y + box!.height, path).toBeLessThanOrEqual(viewport.height);
      }
      const priced = OFFER_PAGES.includes(path)
        ? hero.locator("[data-price-card]")
        : hero.locator("[data-offer-card]").first();
      await expect(priced).toBeVisible();
      await expect(priced).toContainText(PRICE);
      const clipped = await hero
        .locator("h1, p, a, th, td")
        .evaluateAll((els) =>
          els
            .filter((el) => el.scrollWidth > el.clientWidth + 1)
            .map((el) => el.textContent ?? ""),
        );
      expect(clipped).toEqual([]);
    });
  }
}
