import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { OutreachFooter } from "@/components/outreach-footer";
import { OutreachHeader } from "@/components/outreach-header";
import { site } from "@/lib/site";

import { mono, sans, serif } from "../fonts";
import "../globals.css";

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#141414",
};

export const metadata: Metadata = { metadataBase: new URL(site.url) };

export default function OutreachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  setRequestLocale("fr");
  return (
    <html
      lang="fr"
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
    >
      <body>
        <NextIntlClientProvider locale="fr" messages={{}}>
          <div className="relative isolate">
            <div className="rails" aria-hidden="true">
              <div className="container" />
            </div>
            <OutreachHeader />
            <main className="relative">{children}</main>
            <OutreachFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
