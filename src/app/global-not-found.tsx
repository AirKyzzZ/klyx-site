import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { mono, sans, serif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: `${fr.notFound.title} | Klyx`,
};

export default function GlobalNotFound() {
  return (
    <html
      lang="fr"
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
    >
      <body>
        <main className="relative">
          <section data-shot="not-found" className="relative">
            <div className="container flex min-h-svh flex-col items-center justify-center py-24 text-center">
              <p className="type-label text-ui-err">404</p>
              <h1 className="type-h1 mt-4">{fr.notFound.title}</h1>
              <p className="text-text-2 mt-4 max-w-[44ch]">
                {fr.notFound.body}
              </p>
              <p lang="en" className="text-text-3 mt-2 max-w-[44ch] text-sm">
                {en.notFound.title}. {en.notFound.body}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/">{fr.notFound.home}</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/en" hrefLang="en" lang="en">
                    {en.notFound.home}
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
