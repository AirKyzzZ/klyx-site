import { expect, test } from "@playwright/test";

import en from "../messages/en.json";
import fr from "../messages/fr.json";
import { formatPrice } from "../src/lib/offers";

const CASES = [
  {
    path: "/",
    messages: fr,
    prices: [900, 4500, 700].map((amount) => formatPrice(amount, "fr")),
  },
  {
    path: "/en",
    messages: en,
    prices: [900, 4500, 700].map((amount) => formatPrice(amount, "en")),
  },
];

for (const { path, messages, prices } of CASES) {
  for (const width of [390, 1440]) {
    test(`${path} offer cards fit their row and show price and link at ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const cards = page.locator("[data-offer-card]");
      await expect(cards).toHaveCount(3);
      const report = await cards.evaluateAll((els) =>
        els.map((card) => {
          const row = card.parentElement!.getBoundingClientRect();
          const box = card.getBoundingClientRect();
          return {
            card: card.querySelector("h3")?.textContent ?? "",
            inRow: box.left >= row.left - 0.5 && box.right <= row.right + 0.5,
            overflow: card.scrollWidth - card.clientWidth,
          };
        }),
      );
      for (const row of report) {
        expect(row, row.card).toMatchObject({ inRow: true, overflow: 0 });
      }
      for (const [i, price] of prices.entries()) {
        await expect(cards.nth(i)).toContainText(price);
        await expect(
          cards.nth(i).getByRole("link", { name: messages.home.offers.link }),
        ).toBeVisible();
      }
    });
  }
}

test("the nav dropdown prices the AI agents at the Sprint price", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: fr.nav.offers }).click();
  const agents = page
    .locator("header")
    .getByRole("link", { name: new RegExp(fr.nav.agents) });
  await expect(agents).toContainText(
    fr.offers.priceFrom.replace("{price}", formatPrice(4500, "fr")),
  );
});
