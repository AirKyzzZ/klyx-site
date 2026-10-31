"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";

import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const current = useLocale();
  const pathname = usePathname();
  const params = useParams();

  return (
    <nav aria-label="Language" className="flex gap-2">
      {routing.locales.map((locale: Locale) => (
        <Link
          key={locale}
          // @ts-expect-error params are always valid for the current pathname
          href={{ pathname, params }}
          locale={locale}
          aria-current={locale === current ? "true" : undefined}
          className={locale === current ? "font-medium" : "opacity-60"}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
