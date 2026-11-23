import { expect, test } from "@playwright/test";

const GRAPH_PAGES = [
  "/",
  "/en",
  "/cas-usage/immobilier",
  "/cas-usage/agences",
  "/cas-usage/cabinets-services",
];

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

for (const path of GRAPH_PAGES) {
  for (const viewport of VIEWPORTS) {
    test(`${path} hero graph labels are complete at ${viewport.width}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      const stages = await page
        .locator("[data-ls-stage]")
        .evaluateAll((els) => els.map((el) => el.dataset.lsStage ?? ""));
      for (const stage of stages) {
        const report = await page.evaluate((id) => {
          for (const el of document.querySelectorAll<HTMLElement>(
            "[data-ls-stage]",
          )) {
            el.hidden = el.dataset.lsStage !== id;
          }
          const nodes = [
            ...document.querySelectorAll<HTMLElement>(
              `[data-ls-stage="${id}"] .ls-node`,
            ),
          ];
          const clipped = nodes.flatMap((node) =>
            [
              ...node.querySelectorAll<HTMLElement>(
                ".ls-node-label, .ls-node-meta",
              ),
            ]
              .filter((text) => text.scrollWidth > text.clientWidth)
              .map((text) => text.textContent ?? ""),
          );
          const boxes = nodes.map((node) => ({
            id: node.textContent ?? "",
            rect: node.getBoundingClientRect(),
          }));
          const overlaps: string[] = [];
          boxes.forEach((a, i) => {
            for (const b of boxes.slice(i + 1)) {
              const apart =
                a.rect.right <= b.rect.left ||
                b.rect.right <= a.rect.left ||
                a.rect.bottom <= b.rect.top ||
                b.rect.bottom <= a.rect.top;
              if (!apart) overlaps.push(`${a.id} / ${b.id}`);
            }
          });
          const box = document
            .querySelector(`[data-ls-stage="${id}"] .ls-graph-box`)!
            .getBoundingClientRect();
          const outside = boxes
            .filter(
              ({ rect }) =>
                rect.left < box.left - 0.5 || rect.right > box.right + 0.5,
            )
            .map(({ id: label }) => label);
          return { count: nodes.length, clipped, overlaps, outside };
        }, stage);
        expect(report.count, stage).toBeGreaterThan(3);
        expect(report.clipped, stage).toEqual([]);
        expect(report.overlaps, stage).toEqual([]);
        expect(report.outside, stage).toEqual([]);
      }
    });
  }
}

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
        : hero.locator("table");
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
