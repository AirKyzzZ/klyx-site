import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { AnalyticsIsland } from "@/components/analytics/analytics-island";
import { OutreachFooter } from "@/components/outreach-footer";
import { OutreachHeader } from "@/components/outreach-header";
import { Rails } from "@/components/rails";
import { ThemeScript } from "@/components/theme/theme-script";
import { site } from "@/lib/site";
import { THEME_COLORS } from "@/lib/theme";

import { mono, sans, serif } from "../fonts";
import "../globals.css";

export const viewport: Viewport = {
  themeColor: THEME_COLORS.light,
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
      data-theme="light"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <NextIntlClientProvider locale="fr" messages={{}}>
          <div className="relative isolate">
            <Rails />
            <OutreachHeader />
            <main className="relative">{children}</main>
            <OutreachFooter />
            <Suspense>
              <AnalyticsIsland />
            </Suspense>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
