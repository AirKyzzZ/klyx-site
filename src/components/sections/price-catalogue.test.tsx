import type { ReactNode } from "react";

import { render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { getOfferCopy } from "@/lib/offer-copy";
import {
  formatPrice,
  getOffer,
  offers,
  PRICE_CATALOGUE,
  PRICE_GROUPS,
} from "@/lib/offers";

import { PriceCatalogue } from "./price-catalogue";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("PriceCatalogue", () => {
  it("groups every offer exactly once", () => {
    const grouped = PRICE_GROUPS.flatMap((group) => group.offers);
    expect([...grouped].sort()).toEqual(offers.map((o) => o.id).sort());
  });

  for (const locale of routing.locales) {
    it(`shows every offer once with its formatted price in ${locale}`, () => {
      const { container } = render(<PriceCatalogue locale={locale} />);
      const offersT = getStaticTranslator(locale, "offers");
      const entries = PRICE_CATALOGUE.flatMap((group) => group.cards);
      const cards = [
        ...container.querySelectorAll<HTMLElement>("[data-offer-card]"),
      ];
      expect(cards).toHaveLength(entries.length);

      for (const { id, care } of entries) {
        const copy = getOfferCopy(offersT, locale, id);
        const matches = cards.filter(
          (card) =>
            within(card).getByRole("heading", { level: 4 }).textContent ===
            copy.name,
        );
        expect(matches, copy.name).toHaveLength(1);
        const [card] = matches;
        const { priceFrom, page } = getOffer(id);
        expect(priceFrom, copy.name).not.toBeNull();
        expect(card.textContent).toContain(formatPrice(priceFrom!, locale));
        expect(within(card).getByRole("link")).toHaveAttribute("href", page);

        const option = card.querySelector("[data-price-option]");
        if (!care) {
          expect(option, copy.name).toBeNull();
          continue;
        }
        const careCopy = getOfferCopy(offersT, locale, care);
        expect(option?.textContent).toContain(careCopy.name);
        expect(option?.textContent).toContain(careCopy.price);
        const carePrice = getOffer(care).priceFrom;
        if (carePrice !== null) {
          expect(option?.textContent).toContain(formatPrice(carePrice, locale));
        }
      }
    });
  }
});
