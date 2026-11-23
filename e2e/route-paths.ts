import { readdirSync } from "node:fs";

import { type Locale, routing } from "../src/i18n/routing";
import { OUTREACH_PATHS } from "../src/lib/outreach-paths";

export const outreachPaths: string[] = [...OUTREACH_PATHS];

export const SAMPLE_SLUG = "hop-hop-immo";
export const NOT_FOUND_PATH = "/page-introuvable";

function localize(locale: Locale, localized: string) {
  const path = localized.replace("[slug]", SAMPLE_SLUG);
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export const routePaths = routing.locales.flatMap((locale) =>
  Object.entries(routing.pathnames)
    .filter(([pathname]) => pathname !== "/blog/[slug]")
    .map(([, value]) =>
      localize(locale, typeof value === "string" ? value : value[locale]),
    ),
);

const caseSlugs = [
  ...new Set(
    readdirSync("content/realisations").map((file) => file.split(".")[0]),
  ),
];

export const postPaths = readdirSync("content/blog").flatMap((file) => {
  const match = /^(.+)\.(fr|en)\.mdx$/.exec(file);
  if (!match) return [];
  const [, slug, locale] = match;
  return [locale === "fr" ? `/blog/${slug}` : `/en/blog/${slug}`];
});

export const pagePaths = [
  ...new Set([
    ...routePaths,
    ...caseSlugs.flatMap((slug) => [
      `/realisations/${slug}`,
      `/en/work/${slug}`,
    ]),
    ...postPaths,
    NOT_FOUND_PATH,
  ]),
];
