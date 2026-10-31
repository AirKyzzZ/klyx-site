import type { ReactNode } from "react";

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { getOfferCopy } from "@/lib/offer-copy";
import { formatPrice, offers, PRICE_GROUPS } from "@/lib/offers";

import { PriceLedger } from "./price-ledger";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("PriceLedger", () => {
  it("groups every offer exactly once", () => {
    const grouped = PRICE_GROUPS.flatMap((group) => group.offers);
    expect([...grouped].sort()).toEqual(offers.map((o) => o.id).sort());
  });

  for (const locale of routing.locales) {
    it(`lists every offer once with its formatted price in ${locale}`, () => {
      render(<PriceLedger locale={locale} />);
      const offersT = getStaticTranslator(locale, "offers");
      const rows = screen
        .getAllByRole("row")
        .filter((row) => within(row).queryByRole("rowheader"));
      expect(rows).toHaveLength(offers.length);

      for (const offer of offers) {
        const copy = getOfferCopy(offersT, locale, offer.id);
        const matches = rows.filter(
          (row) => within(row).getByRole("rowheader").textContent === copy.name,
        );
        expect(matches, copy.name).toHaveLength(1);
        const [row] = matches;
        expect(row.textContent).toContain(copy.price);
        if (offer.priceFrom !== null) {
          expect(row.textContent).toContain(
            formatPrice(offer.priceFrom, locale),
          );
        }
        expect(within(row).getByRole("link")).toHaveAttribute(
          "href",
          offer.page,
        );
      }
    });
  }
});
