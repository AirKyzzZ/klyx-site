import { getStaticTranslator } from "@/i18n/static-translator";
import type { Locale } from "@/i18n/routing";

import { getOfferCopy } from "./offer-copy";
import type { OfferPageKey } from "./offer-pages";
import { getOffer, type OfferId } from "./offers";
import { type AppPathname, absoluteUrl } from "./seo";
import { site, socialLinks } from "./site";

export type JsonLdObject = Record<string, unknown>;

const CONTEXT = "https://schema.org";
const ORGANIZATION_ID = `${site.url}/#organization`;
const PERSON_ID = `${site.url}/#person`;
const UNIT_CODES = { day: "DAY", month: "MON" } as const;

const AREA_SERVED = [
  { "@type": "City", name: "Bordeaux" },
  { "@type": "AdministrativeArea", name: "Nouvelle-Aquitaine" },
  { "@type": "Country", name: "France" },
];

export function organizationJsonLd(description?: string): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORGANIZATION_ID,
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/klyx-black.png`,
    image: `${site.url}/brand/klyx-black.png`,
    ...(description ? { description } : {}),
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: "Nouvelle-Aquitaine",
      addressCountry: "FR",
    },
    areaServed: AREA_SERVED,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "SIRET",
      value: site.siret.replace(/\s/g, ""),
    },
    founder: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: site.founder,
    },
    sameAs: socialLinks.map((link) => link.href),
  };
}

export function personJsonLd(): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.founder,
    url: absoluteUrl("fr", "/a-propos"),
    jobTitle: "Founder",
    worksFor: { "@id": ORGANIZATION_ID },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: "FR",
    },
    sameAs: [site.socials.linkedinFounder, site.socials.github],
  };
}

export function serviceJsonLd(
  offerIds: readonly OfferId[],
  locale: Locale,
): JsonLdObject[] {
  const t = getStaticTranslator(locale, "offers");
  return offerIds.map((id) => {
    const offer = getOffer(id);
    const copy = getOfferCopy(t, locale, id);
    const url = absoluteUrl(locale, offer.page);
    const price = offer.priceFrom === null ? {} : { price: offer.priceFrom };
    const unitCode =
      offer.unit === "project" ? {} : { unitCode: UNIT_CODES[offer.unit] };
    return {
      "@context": CONTEXT,
      "@type": "Service",
      "@id": `${url}#${id}`,
      name: copy.name,
      description: copy.summary,
      url,
      provider: { "@id": ORGANIZATION_ID },
      areaServed: AREA_SERVED,
      offers: {
        "@type": "Offer",
        url,
        ...price,
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          ...price,
          priceCurrency: "EUR",
          valueAddedTaxIncluded: false,
          ...unitCode,
        },
      },
    };
  });
}

export function faqJsonLd(items: { q: string; a: string }[]): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function offerPageJsonLd({
  locale,
  pathname,
  navKey,
  offerIds,
  faq,
}: {
  locale: Locale;
  pathname: AppPathname;
  navKey: OfferPageKey;
  offerIds: readonly OfferId[];
  faq: { question: string; answer: string }[];
}): JsonLdObject[] {
  const nav = getStaticTranslator(locale, "nav");
  return [
    ...serviceJsonLd(offerIds, locale),
    faqJsonLd(faq.map((item) => ({ q: item.question, a: item.answer }))),
    breadcrumbJsonLd([
      { name: nav("home"), url: absoluteUrl(locale, "/") },
      { name: nav(navKey), url: absoluteUrl(locale, pathname) },
    ]),
  ];
}
