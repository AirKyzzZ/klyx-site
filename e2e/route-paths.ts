import { readdirSync } from "node:fs";

import { type Locale, routing } from "../src/i18n/routing";

export const SAMPLE_SLUG = "hop-hop-immo";
export const NOT_FOUND_PATH = "/page-introuvable";
export const HIDDEN_CASE = "kenzi";

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
].filter((slug) => slug !== HIDDEN_CASE);

export const pagePaths = [
  ...new Set([
    ...routePaths,
    ...caseSlugs.flatMap((slug) => [
      `/realisations/${slug}`,
      `/en/work/${slug}`,
    ]),
    NOT_FOUND_PATH,
  ]),
];
