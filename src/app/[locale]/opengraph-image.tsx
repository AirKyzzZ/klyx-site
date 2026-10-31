import { hasLocale } from "next-intl";
import { ImageResponse } from "next/og";

import { routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const hero = getStaticTranslator(locale, "home.hero");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#0a0a0a",
        color: "#fafafa",
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 700 }}>klyx</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 60, lineHeight: 1.1 }}>
          {`${hero("title")} ${hero("titleEmphasis")}`}
        </div>
        <div style={{ fontSize: 28, opacity: 0.7 }}>
          {`${site.url.replace("https://", "")} · ${site.city}`}
        </div>
      </div>
    </div>,
    size,
  );
}
