import type { Metadata, Viewport } from "next";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { NotFoundLocale } from "@/components/not-found-locale";
import { NotFoundView } from "@/components/not-found-view";
import { ThemeScript } from "@/components/theme/theme-script";
import { Button } from "@/components/ui/button";
import { THEME_COLORS } from "@/lib/theme";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { mono, sans, serif } from "./fonts";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: THEME_COLORS.light,
};

export const metadata: Metadata = {
  title: `${fr.notFound.title} | Klyx`,
};

const VIEWS = [
  {
    lang: "fr",
    copy: fr.notFound,
    home: "/",
    contact: "/contact",
    other: { href: "/en", label: fr.notFound.english, lang: "en" },
  },
  {
    lang: "en",
    copy: en.notFound,
    home: "/en",
    contact: "/en/contact",
    other: { href: "/", label: en.notFound.french, lang: "fr" },
  },
] as const;

function renderView(view: (typeof VIEWS)[number]) {
  return (
    <section data-shot="not-found" lang={view.lang} className="relative">
      <NotFoundView
        className="container flex min-h-svh flex-col items-center justify-center py-24 text-center"
        copy={view.copy}
        home={view.home}
        actions={
          <>
            <Button size="lg" asChild>
              <Link href={view.home}>{view.copy.home}</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href={view.contact}>
                {view.copy.contact}
                <ArrowRight />
              </Link>
            </Button>
          </>
        }
        footer={
          <Link
            href={view.other.href}
            hrefLang={view.other.lang}
            lang={view.other.lang}
            className="type-label text-text-3 hover:text-text mt-8 transition-colors"
          >
            {view.other.label}
          </Link>
        }
      />
    </section>
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
          <NotFoundLocale fr={renderView(VIEWS[0])} en={renderView(VIEWS[1])} />
        </main>
      </body>
    </html>
  );
}
