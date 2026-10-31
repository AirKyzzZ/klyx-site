import type { Locale } from "@/i18n/routing";

export type OfferId =
  | "landing"
  | "site-ia"
  | "site-custom"
  | "audit-ia"
  | "sprint-ia"
  | "retainer"
  | "fde";

export type Offer = {
  id: OfferId;
  page:
    | "/services/creation-site-web"
    | "/services/agents-ia"
    | "/forward-deployed-engineer";
  priceFrom: number | null;
  unit: "project" | "day" | "month";
  durationKey: string;
};

export const offers: Offer[] = [
  {
    id: "landing",
    page: "/services/creation-site-web",
    priceFrom: 900,
    unit: "project",
    durationKey: "landing",
  },
  {
    id: "site-ia",
    page: "/services/creation-site-web",
    priceFrom: 2900,
    unit: "project",
    durationKey: "siteIa",
  },
  {
    id: "site-custom",
    page: "/services/creation-site-web",
    priceFrom: 5700,
    unit: "project",
    durationKey: "siteCustom",
  },
  {
    id: "audit-ia",
    page: "/services/agents-ia",
    priceFrom: 1500,
    unit: "project",
    durationKey: "auditIa",
  },
  {
    id: "sprint-ia",
    page: "/services/agents-ia",
    priceFrom: 4500,
    unit: "project",
    durationKey: "sprintIa",
  },
  {
    id: "retainer",
    page: "/services/agents-ia",
    priceFrom: null,
    unit: "month",
    durationKey: "retainer",
  },
  {
    id: "fde",
    page: "/forward-deployed-engineer",
    priceFrom: 700,
    unit: "day",
    durationKey: "fde",
  },
];

export function formatPrice(amount: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
  return locale === "fr" ? `${formatted} HT` : `${formatted} excl. VAT`;
}

export const FDE_MIN_DAYS_PER_WEEK = 2;
export const FDE_MIN_WEEKS = 4;

export function getOffer(id: OfferId): Offer {
  const offer = offers.find((o) => o.id === id);
  if (!offer) throw new Error(`Unknown offer: ${id}`);
  return offer;
}

export function getOfferPrice(id: OfferId): number {
  const { priceFrom } = getOffer(id);
  if (priceFrom === null) throw new Error(`Offer ${id} has no public price`);
  return priceFrom;
}

export function getPriceValues(locale: Locale) {
  const price = (id: OfferId) => formatPrice(getOfferPrice(id), locale);
  return {
    landingPrice: price("landing"),
    siteIaPrice: price("site-ia"),
    siteCustomPrice: price("site-custom"),
    auditPrice: price("audit-ia"),
    sprintPrice: price("sprint-ia"),
    fdeDayPrice: price("fde"),
    fdeMinimum: formatPrice(
      getOfferPrice("fde") * FDE_MIN_DAYS_PER_WEEK * FDE_MIN_WEEKS,
      locale,
    ),
  };
}
