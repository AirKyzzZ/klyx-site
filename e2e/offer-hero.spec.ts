import { expect, test } from "@playwright/test";

const OFFER_PAGES = [
  "/",
  "/en",
  "/services/creation-site-web",
  "/services/agents-ia",
  "/forward-deployed-engineer",
  "/services/audit-ia",
  "/services/automatisation-ia",
  "/services/geo-referencement-ia",
  "/en/services/ai-audit",
  "/en/services/ai-automation",
  "/en/services/ai-search-visibility",
  "/cas-usage/immobilier",
  "/cas-usage/agences",
  "/cas-usage/cabinets-services",
];

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];

test.use({ reducedMotion: "reduce" });

for (const path of OFFER_PAGES) {
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
