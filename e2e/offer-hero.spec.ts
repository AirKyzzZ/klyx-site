import { expect, test } from "@playwright/test";

const OFFER_PAGES = [
  "/services/creation-site-web",
  "/services/agents-ia",
  "/forward-deployed-engineer",
  "/services/audit-ia",
  "/services/automatisation-ia",
  "/services/geo-referencement-ia",
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
      const report = await page.evaluate(() => {
        const nodes = [
          ...document.querySelectorAll<HTMLElement>(
            ".ls-stage:not([hidden]) .ls-node",
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
        return { count: nodes.length, clipped, overlaps };
      });
      expect(report.count).toBeGreaterThan(3);
      expect(report.clipped).toEqual([]);
      expect(report.overlaps).toEqual([]);
    });
  }
}
