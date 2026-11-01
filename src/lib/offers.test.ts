import { describe, expect, it } from "vitest";
import { formatPrice, getOffer, getPriceValues, offers } from "./offers";

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
      automation: 2400,
      "automation-care": 190,
      geo: 1200,
      "geo-care": 590,
    });
  });

  it("bills the follow-up options per month", () => {
    expect(getOffer("automation-care").unit).toBe("month");
    expect(getOffer("geo-care").unit).toBe("month");
  });

  it("links each offer to its own service page", () => {
    expect(getOffer("audit-ia").page).toBe("/services/audit-ia");
    expect(getOffer("automation").page).toBe("/services/automatisation-ia");
    expect(getOffer("automation-care").page).toBe(
      "/services/automatisation-ia",
    );
    expect(getOffer("geo").page).toBe("/services/geo-referencement-ia");
    expect(getOffer("geo-care").page).toBe("/services/geo-referencement-ia");
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
      "automationCarePrice",
      "automationPrice",
      "fdeDayPrice",
      "fdeMinimum",
      "geoCarePrice",
      "geoPrice",
      "landingPrice",
      "siteCustomPrice",
      "siteIaPrice",
      "sprintPrice",
    ]);
  });
});
