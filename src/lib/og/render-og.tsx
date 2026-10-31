import { readFile } from "node:fs/promises";
import path from "node:path";

import { hasLocale } from "next-intl";
import { ImageResponse } from "next/og";

import { type Locale, routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { site } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

const COLORS = {
  bg: "#141414",
  surface: "#211F1D",
  line: "rgba(237,232,222,0.14)",
  text: "#EDEAE3",
  text2: "#A8A29A",
  text3: "#948E85",
  accent: "#F54E00",
};

const NODES = [
  { x: 40, y: 60, label: "trigger" },
  { x: 230, y: 190, label: "agent" },
  { x: 40, y: 320, label: "tool" },
  { x: 230, y: 450, label: "result" },
];

const EDGES = [
  "M150 100 C 200 100, 190 230, 230 230",
  "M230 230 C 180 230, 200 360, 150 360",
  "M150 360 C 200 360, 190 490, 230 490",
];

function asset(file: string) {
  return readFile(path.join(process.cwd(), "public", file));
}

async function grainDataUrl() {
  const png = await asset("textures/grain.png");
  return `data:image/png;base64,${png.toString("base64")}`;
}

function words(text: string | undefined): string[] {
  return text ? text.split(/\s+/).filter(Boolean) : [];
}

function GraphGlyph() {
  return (
    <div
      style={{ display: "flex", position: "relative", width: 360, height: 540 }}
    >
      <svg
        width="360"
        height="540"
        viewBox="0 0 360 540"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {EDGES.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={COLORS.line}
            strokeWidth="2"
          />
        ))}
        <circle cx="196" cy="160" r="16" fill="rgba(245,78,0,0.25)" />
        <circle cx="196" cy="160" r="6" fill={COLORS.accent} />
      </svg>
      {NODES.map((node, i) => (
        <div
          key={node.label}
          style={{
            position: "absolute",
            left: node.x,
            top: node.y,
            width: 110,
            height: 80,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "12px 14px",
            borderRadius: 10,
            border: `1px solid ${i === 1 ? COLORS.accent : COLORS.line}`,
            background: COLORS.surface,
            fontFamily: "Geist Mono",
            fontSize: 15,
            color: COLORS.text2,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: i === 1 ? COLORS.accent : COLORS.text3,
            }}
          />
          {node.label}
        </div>
      ))}
    </div>
  );
}

export async function renderOg({
  title,
  emphasis,
}: {
  title: string;
  emphasis?: string;
}) {
  const [sans, mono, grain] = await Promise.all([
    asset("fonts/geist-600.ttf"),
    asset("fonts/geist-mono-400.ttf"),
    grainDataUrl(),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: COLORS.bg,
        backgroundImage: `url(${grain})`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        color: COLORS.text,
        padding: "72px 72px 64px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 700,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Geist Mono",
            fontSize: 20,
            letterSpacing: "0.06em",
            color: COLORS.text3,
          }}
        >
          {`KLYX · ${site.city.toUpperCase()}`}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "Geist",
            fontSize: 64,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
          }}
        >
          {[
            ...words(title).map((word) => ({ word, color: COLORS.text })),
            ...words(emphasis).map((word) => ({ word, color: COLORS.text2 })),
          ].map(({ word, color }, i) => (
            <span key={i} style={{ color, marginRight: 16 }}>
              {word}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Geist Mono",
            fontSize: 24,
            color: COLORS.text3,
          }}
        >
          {site.url.replace("https://", "")}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 72,
          top: 45,
        }}
      >
        <GraphGlyph />
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: sans, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}

export async function resolveOgLocale(
  params: Promise<{ locale: string }>,
): Promise<Locale> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

export function pageOgImage(namespace: string) {
  return async function OpengraphImage({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const t = getStaticTranslator(await resolveOgLocale(params), namespace);
    return renderOg({
      title: t("hero.title"),
      emphasis: t("hero.titleEmphasis"),
    });
  };
}
