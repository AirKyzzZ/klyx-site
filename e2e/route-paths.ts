import { type Locale, routing } from "../src/i18n/routing";

export const SAMPLE_SLUG = "hop-hop-immo";

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
