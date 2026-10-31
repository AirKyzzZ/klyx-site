"use client";

import { useLocale } from "next-intl";
import NextLink from "next/link";
import { useParams } from "next/navigation";

import { getLocaleHref } from "@/i18n/locale-href";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const current = useLocale();
  const pathname = usePathname();
  const params = useParams();

  return (
    <nav aria-label="Language" className="flex gap-2">
      {routing.locales.map((locale) => (
        <NextLink
          key={locale}
          href={getLocaleHref(locale, pathname, params)}
          hrefLang={locale}
          aria-current={locale === current ? "true" : undefined}
          className={locale === current ? "font-medium" : "opacity-60"}
        >
          {locale.toUpperCase()}
        </NextLink>
      ))}
    </nav>
  );
}
