import { describe, expect, it } from "vitest";
import { formatPrice, getPriceValues, offers } from "./offers";

const normalize = (value: string) => value.replace(/[\s  ]/g, " ");

describe("offers", () => {
  it("keeps the published starting prices", () => {
    const prices = Object.fromEntries(offers.map((o) => [o.id, o.priceFrom]));
    expect(prices).toEqual({
      landing: 900,
      "site-ia": 2900,
      "site-custom": 5700,
      "audit-ia": 1500,
      "sprint-ia": 4500,
      retainer: null,
      fde: 700,
    });
  });
});

describe("formatPrice", () => {
  it("formats french prices excl. tax", () => {
    expect(normalize(formatPrice(2900, "fr"))).toBe("2 900 € HT");
  });

  it("formats english prices excl. VAT", () => {
    expect(formatPrice(2900, "en")).toBe("€2,900 excl. VAT");
  });
});

describe("getPriceValues", () => {
  it("derives the FDE minimum from 700 x 2 days x 4 weeks", () => {
    expect(normalize(getPriceValues("fr").fdeMinimum)).toBe("5 600 € HT");
  });

  it("exposes every price placeholder used in the copy", () => {
    expect(Object.keys(getPriceValues("en")).sort()).toEqual([
      "auditPrice",
      "fdeDayPrice",
      "fdeMinimum",
      "landingPrice",
      "siteCustomPrice",
      "siteIaPrice",
      "sprintPrice",
    ]);
  });
});
