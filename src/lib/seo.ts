import type { Metadata } from "next";

import { getLocaleHref } from "@/i18n/locale-href";
import { type Locale, routing } from "@/i18n/routing";

import { MARKDOWN_TYPE, pageMarkdownHref } from "./machine/markdown-href";
import { site } from "./site";

export type AppPathname = keyof typeof routing.pathnames;
type PathParams = Record<string, string>;

const OG_IMAGE_PATHNAMES: AppPathname[] = [
  "/a-propos",
  "/agence-ia-bordeaux",
  "/cas-usage",
  "/cas-usage/immobilier",
  "/cas-usage/agences",
  "/cas-usage/cabinets-services",
  "/contact",
  "/faq",
  "/realisations",
  "/realisations/[slug]",
  "/services/creation-site-web",
  "/services/agents-ia",
  "/services/audit-ia",
  "/services/automatisation-ia",
  "/services/geo-referencement-ia",
  "/forward-deployed-engineer",
  "/tarifs",
];

export function ogImageUrl(
  locale: Locale,
  pathname: AppPathname,
  params: PathParams = {},
): string {
  const segment = OG_IMAGE_PATHNAMES.includes(pathname)
    ? pathname.replace(/\[(\w+)\]/g, (_, key: string) => params[key] ?? "")
    : "";
  return `${site.url}/${locale}${segment}/opengraph-image`;
}

const OG_LOCALES: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };
const TITLE_MAX = 60;
const BRAND_SUFFIX = ` | ${site.name}`;

export function absoluteUrl(
  locale: Locale,
  pathname: AppPathname,
  params: PathParams = {},
): string {
  return `${site.url}${getLocaleHref(locale, pathname, params)}`;
}

export function languageAlternates(
  pathname: AppPathname,
  params: PathParams = {},
) {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      absoluteUrl(locale, pathname, params),
    ]),
  ) as Record<Locale, string>;
  return { ...languages, "x-default": languages[routing.defaultLocale] };
}

export function brandedTitle(title: string): string {
  const branded = `${title}${BRAND_SUFFIX}`;
  return branded.length <= TITLE_MAX ? branded : title;
}

export function buildMetadata({
  locale,
  pathname,
  params,
  title,
  description,
  type = "website",
}: {
  locale: Locale;
  pathname: AppPathname;
  params?: PathParams;
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const canonical = absoluteUrl(locale, pathname, params);
  const image = {
    url: ogImageUrl(locale, pathname, params),
    width: 1200,
    height: 630,
    alt: title,
  };
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: languageAlternates(pathname, params),
      types: {
        [MARKDOWN_TYPE]: `${site.url}${pageMarkdownHref(locale, { pathname, params })}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.name,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((other) => other !== locale)
        .map((other) => OG_LOCALES[other]),
      type,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
