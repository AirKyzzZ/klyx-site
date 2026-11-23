import { messageList, type Translate } from "@/i18n/message-list";
import { type Locale, routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";

import type { CaseStudyMeta, PostMeta } from "./content";
import { getOfferCopy } from "./offer-copy";
import type { OfferPageKey } from "./offer-pages";
import { getOffer, type OfferId, PRICE_GROUPS } from "./offers";
import { type AppPathname, absoluteUrl, ogImageUrl } from "./seo";
import { site } from "./site";

export type JsonLdObject = Record<string, unknown>;

const CONTEXT = "https://schema.org";
const ORGANIZATION_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;
const PERSON_ID = `${site.url}/#person`;
const UNIT_CODES = { day: "DAY", month: "MON" } as const;

const AREA_SERVED = [
  { "@type": "City", name: "Bordeaux" },
  { "@type": "AdministrativeArea", name: "Gironde" },
  { "@type": "Country", name: "France" },
];

const ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: site.city,
  addressCountry: "FR",
};

const FOUNDER_KNOWS_ABOUT = [
  "Agents IA",
  "Automatisation IA",
  "Serveurs MCP",
  "Next.js",
  "TypeScript",
  "Référencement IA (GEO)",
];

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORGANIZATION_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/brand/klyx-black.png`,
    image: `${site.url}/brand/klyx-black.png`,
    description: site.description,
    email: site.email,
    telephone: site.phoneE164,
    address: ADDRESS,
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
    sameAs: [site.socials.linkedinCompany, site.socials.instagram],
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: [...routing.locales],
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function personJsonLd(): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.founder,
    url: absoluteUrl("fr", "/a-propos"),
    image: `${site.url}/team/maxime-mansiet.jpg`,
    jobTitle: "Fondateur et développeur",
    worksFor: { "@id": ORGANIZATION_ID },
    knowsAbout: FOUNDER_KNOWS_ABOUT,
    address: ADDRESS,
    sameAs: [site.socials.github, site.socials.linkedinFounder],
  };
}

function webPageJsonLd(
  type: string,
  locale: Locale,
  pathname: AppPathname,
  metaKey: string,
  extra: JsonLdObject = {},
): JsonLdObject {
  const meta = getStaticTranslator(locale, `meta.${metaKey}`);
  const url = absoluteUrl(locale, pathname);
  return {
    "@context": CONTEXT,
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: meta("title"),
    description: meta("description"),
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    ...extra,
  };
}

export function aboutPageJsonLd(locale: Locale): JsonLdObject[] {
  return [
    webPageJsonLd("AboutPage", locale, "/a-propos", "about", {
      about: { "@id": ORGANIZATION_ID },
    }),
    personJsonLd(),
  ];
}

export function contactPageJsonLd(locale: Locale): JsonLdObject {
  return webPageJsonLd("ContactPage", locale, "/contact", "contact", {
    about: { "@id": ORGANIZATION_ID },
  });
}

function offerJsonLd(id: OfferId, url: string): JsonLdObject {
  const offer = getOffer(id);
  const price = offer.priceFrom === null ? {} : { price: offer.priceFrom };
  const unitCode =
    offer.unit === "project" ? {} : { unitCode: UNIT_CODES[offer.unit] };
  return {
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
  };
}

export function serviceJsonLd(
  offerIds: readonly OfferId[],
  locale: Locale,
): JsonLdObject[] {
  const t = getStaticTranslator(locale, "offers");
  return offerIds.map((id) => {
    const copy = getOfferCopy(t, locale, id);
    const url = absoluteUrl(locale, getOffer(id).page);
    return {
      "@context": CONTEXT,
      "@type": "Service",
      "@id": `${url}#${id}`,
      name: copy.name,
      description: copy.summary,
      url,
      provider: { "@id": ORGANIZATION_ID },
      areaServed: AREA_SERVED,
      offers: offerJsonLd(id, url),
    };
  });
}

function catalogOfferJsonLd(
  id: OfferId,
  locale: Locale,
  t: Translate,
): JsonLdObject {
  const copy = getOfferCopy(t, locale, id);
  const url = absoluteUrl(locale, getOffer(id).page);
  return {
    ...offerJsonLd(id, url),
    offeredBy: { "@id": ORGANIZATION_ID },
    itemOffered: {
      "@type": "Service",
      "@id": `${url}#${id}`,
      name: copy.name,
      description: copy.summary,
    },
  };
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

export function pricingPageJsonLd(locale: Locale): JsonLdObject[] {
  const t = getStaticTranslator(locale, "pricing");
  const offersT = getStaticTranslator(locale, "offers");
  const meta = getStaticTranslator(locale, "meta.pricing");
  const url = absoluteUrl(locale, "/tarifs");
  return [
    {
      "@context": CONTEXT,
      "@type": "OfferCatalog",
      "@id": `${url}#catalog`,
      name: meta("title"),
      url,
      itemListElement: PRICE_GROUPS.map((group) => ({
        "@type": "OfferCatalog",
        name: t(`table.groups.${group.key}`),
        itemListElement: group.offers.map((id) =>
          catalogOfferJsonLd(id, locale, offersT),
        ),
      })),
    },
    faqJsonLd(
      messageList(t, "faq.items", ["question", "answer"]).map((item) => ({
        q: item.question,
        a: item.answer,
      })),
    ),
  ];
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

export function trailPageJsonLd({
  locale,
  trail,
  offerIds = [],
  faq = [],
}: {
  locale: Locale;
  trail: { name: string; pathname: AppPathname }[];
  offerIds?: readonly OfferId[];
  faq?: { question: string; answer: string }[];
}): JsonLdObject[] {
  const nav = getStaticTranslator(locale, "nav");
  return [
    ...serviceJsonLd(offerIds, locale),
    ...(faq.length > 0
      ? [faqJsonLd(faq.map((item) => ({ q: item.question, a: item.answer })))]
      : []),
    breadcrumbJsonLd([
      { name: nav("home"), url: absoluteUrl(locale, "/") },
      ...trail.map((item) => ({
        name: item.name,
        url: absoluteUrl(locale, item.pathname),
      })),
    ]),
  ];
}

export function caseListJsonLd(
  locale: Locale,
  cases: readonly CaseStudyMeta[],
): JsonLdObject {
  return webPageJsonLd("CollectionPage", locale, "/realisations", "cases", {
    mainEntity: {
      "@type": "ItemList",
      itemListElement: cases.map((study, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: study.title,
        url: absoluteUrl(locale, "/realisations/[slug]", { slug: study.slug }),
      })),
    },
  });
}

export function caseStudyJsonLd(
  locale: Locale,
  study: CaseStudyMeta,
): JsonLdObject[] {
  const nav = getStaticTranslator(locale, "nav");
  const listUrl = absoluteUrl(locale, "/realisations");
  const url = absoluteUrl(locale, "/realisations/[slug]", { slug: study.slug });
  return [
    {
      "@context": CONTEXT,
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      url,
      name: study.title,
      description: study.summary,
      inLanguage: locale,
      image: `${site.url}${study.image}`,
      dateCreated: String(study.year),
      creator: { "@id": ORGANIZATION_ID },
      isPartOf: { "@id": `${listUrl}#webpage` },
    },
    breadcrumbJsonLd([
      { name: nav("home"), url: absoluteUrl(locale, "/") },
      { name: nav("cases"), url: listUrl },
      { name: study.title, url },
    ]),
  ];
}

const blogId = (locale: Locale) => `${absoluteUrl(locale, "/blog")}#blog`;

export function blogJsonLd(
  locale: Locale,
  posts: readonly PostMeta[],
): JsonLdObject {
  const meta = getStaticTranslator(locale, "meta.blog");
  return {
    "@context": CONTEXT,
    "@type": "Blog",
    "@id": blogId(locale),
    url: absoluteUrl(locale, "/blog"),
    name: meta("title"),
    description: meta("description"),
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
    blogPost: posts.map((post) => {
      const url = absoluteUrl(locale, "/blog/[slug]", { slug: post.slug });
      return {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        headline: post.title,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
      };
    }),
  };
}

export function blogPostingJsonLd({
  locale,
  slug,
  title,
  summary,
  date,
  updated,
  sources = [],
}: {
  locale: Locale;
  slug: string;
  title: string;
  summary: string;
  date: string;
  updated?: string;
  sources?: { title: string; url: string }[];
}): JsonLdObject[] {
  const nav = getStaticTranslator(locale, "nav");
  const url = absoluteUrl(locale, "/blog/[slug]", { slug });
  return [
    {
      "@context": CONTEXT,
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: url,
      url,
      headline: title,
      description: summary,
      inLanguage: locale,
      image: ogImageUrl(locale, "/blog/[slug]", { slug }),
      datePublished: date,
      dateModified: updated ?? date,
      author: {
        "@type": "Person",
        "@id": PERSON_ID,
        name: site.founder,
        url: absoluteUrl(locale, "/a-propos"),
      },
      publisher: { "@id": ORGANIZATION_ID },
      isPartOf: { "@id": blogId(locale) },
      ...(sources.length > 0
        ? {
            citation: sources.map((source) => ({
              "@type": "CreativeWork",
              name: source.title,
              url: source.url,
            })),
          }
        : {}),
    },
    breadcrumbJsonLd([
      { name: nav("home"), url: absoluteUrl(locale, "/") },
      { name: nav("blog"), url: absoluteUrl(locale, "/blog") },
      { name: title, url },
    ]),
  ];
}
