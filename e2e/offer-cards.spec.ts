import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

for (const path of ["/", "/en"]) {
  test(`${path} offer cards and their flow strips fit at 390`, async ({
    page,
  }) => {
    await page.goto(path);
    const report = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("[data-offer-card]")].map(
        (card) => {
          const grid = card.parentElement!.getBoundingClientRect();
          const box = card.getBoundingClientRect();
          const strip = card.querySelector<HTMLElement>("[data-flow-glyph]")!;
          const stripBox = strip.getBoundingClientRect();
          const lastStep = strip.lastElementChild!.lastElementChild!;
          return {
            card: card.textContent?.slice(0, 24),
            cardInGrid:
              box.left >= grid.left - 0.5 && box.right <= grid.right + 0.5,
            stripInCard: stripBox.right <= box.right + 0.5,
            stepsInStrip:
              lastStep.getBoundingClientRect().right <= stripBox.right + 0.5,
          };
        },
      ),
    );
    expect(report).toHaveLength(3);
    for (const row of report) {
      expect(row, row.card).toMatchObject({
        cardInGrid: true,
        stripInCard: true,
        stepsInStrip: true,
      });
    }
  });
}
