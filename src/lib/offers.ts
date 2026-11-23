import type { Locale } from "@/i18n/routing";

import type { OfferPathname } from "./offer-pages";

export type OfferId =
  | "landing"
  | "site-ia"
  | "site-custom"
  | "audit-ia"
  | "sprint-ia"
  | "retainer"
  | "fde"
  | "automation"
  | "automation-care"
  | "geo"
  | "geo-care";

export type Offer = {
  id: OfferId;
  page: OfferPathname;
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
    page: "/services/audit-ia",
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
  {
    id: "automation",
    page: "/services/automatisation-ia",
    priceFrom: 2400,
    unit: "project",
    durationKey: "automation",
  },
  {
    id: "automation-care",
    page: "/services/automatisation-ia",
    priceFrom: 190,
    unit: "month",
    durationKey: "automationCare",
  },
  {
    id: "geo",
    page: "/services/geo-referencement-ia",
    priceFrom: 1200,
    unit: "project",
    durationKey: "geo",
  },
  {
    id: "geo-care",
    page: "/services/geo-referencement-ia",
    priceFrom: 590,
    unit: "month",
    durationKey: "geoCare",
  },
];

export type PriceGroupKey = "sites" | "ai" | "fde";

export type CatalogueEntry = { id: OfferId; care?: OfferId };

export const PRICE_CATALOGUE: {
  key: PriceGroupKey;
  cards: CatalogueEntry[];
}[] = [
  {
    key: "sites",
    cards: [
      { id: "landing" },
      { id: "site-ia" },
      { id: "site-custom" },
      { id: "geo", care: "geo-care" },
    ],
  },
  {
    key: "ai",
    cards: [
      { id: "audit-ia" },
      { id: "automation", care: "automation-care" },
      { id: "sprint-ia", care: "retainer" },
    ],
  },
  { key: "fde", cards: [{ id: "fde" }] },
];

export const PRICE_GROUPS: { key: PriceGroupKey; offers: OfferId[] }[] =
  PRICE_CATALOGUE.map(({ key, cards }) => ({
    key,
    offers: cards.flatMap(({ id, care }) => (care ? [id, care] : [id])),
  }));

export function formatPrice(amount: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replaceAll("\u202f", "\u00a0");
  return locale === "fr" ? `${formatted}\u00a0HT` : `${formatted} excl. VAT`;
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
    automationPrice: price("automation"),
    automationCarePrice: price("automation-care"),
    geoPrice: price("geo"),
    geoCarePrice: price("geo-care"),
    fdeDayPrice: price("fde"),
    fdeMinimum: formatPrice(
      getOfferPrice("fde") * FDE_MIN_DAYS_PER_WEEK * FDE_MIN_WEEKS,
      locale,
    ),
  };
}
