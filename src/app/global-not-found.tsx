import type { Metadata, Viewport } from "next";
import Link from "next/link";

import { NotFoundLocale } from "@/components/not-found-locale";
import { NotFoundView } from "@/components/not-found-view";
import { ThemeScript } from "@/components/theme/theme-script";
import type { Locale } from "@/i18n/routing";
import { THEME_COLORS } from "@/lib/theme";

import fr from "../../messages/fr.json";
import { mono, sans, serif } from "./fonts";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: THEME_COLORS.light,
};

export const metadata: Metadata = {
  title: `${fr.notFound.title} | Klyx`,
};

const OTHER: Record<Locale, { href: string; label: string; lang: Locale }> = {
  fr: { href: "/en", label: fr.notFound.english, lang: "en" },
  en: { href: "/", label: fr.notFound.french, lang: "fr" },
};

function renderView(locale: Locale) {
  const other = OTHER[locale];
  return (
    <NotFoundView
      locale={locale}
      className="flex min-h-svh flex-col justify-center"
      footer={
        <Link
          href={other.href}
          hrefLang={other.lang}
          lang={other.lang}
          className="text-text-3 hover:text-text mt-8 text-sm font-medium transition-colors duration-(--d-fast)"
        >
          {other.label}
        </Link>
      }
    />
  );
}

export default function GlobalNotFound() {
  return (
    <html
      lang="fr"
      data-theme="light"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <main className="relative">
          <NotFoundLocale fr={renderView("fr")} en={renderView("en")} />
        </main>
      </body>
    </html>
  );
}
