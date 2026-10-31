import type { Metadata } from "next";

import { getLocaleHref } from "@/i18n/locale-href";
import { type Locale, routing } from "@/i18n/routing";

import { site } from "./site";

export type AppPathname = keyof typeof routing.pathnames;
type PathParams = Record<string, string>;

const OG_LOCALES: Record<Locale, string> = { fr: "fr_FR", en: "en_GB" };
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
}: {
  locale: Locale;
  pathname: AppPathname;
  params?: PathParams;
  title: string;
  description: string;
}): Metadata {
  const canonical = absoluteUrl(locale, pathname, params);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical, languages: languageAlternates(pathname, params) },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.name,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((other) => other !== locale)
        .map((other) => OG_LOCALES[other]),
      type: "website",
      images: [
        {
          url: `${site.url}/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
    },
  };
}
