import { readFile } from "node:fs/promises";
import path from "node:path";

import { hasLocale } from "next-intl";
import { ImageResponse } from "next/og";

import { KLYX_MARK_PATH } from "@/components/brand/klyx-mark";
import { type Locale, routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { site } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

const COLORS = {
  bg: "#FBFAF8",
  line: "#E9E5DD",
  lineStrong: "#D6D0C4",
  text: "#1A1917",
  text2: "#5E5850",
  text3: "#8F887E",
  accent: "#F54E00",
};

const RAIL = 64;
const BAND = 104;
const CONTENT_X = RAIL + 44;

function asset(file: string) {
  return readFile(path.join(process.cwd(), "public", file));
}

async function grainDataUrl() {
  const png = await asset("textures/grain-sand.png");
  return `data:image/png;base64,${png.toString("base64")}`;
}

function words(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .split(/[ \t\n]+/)
    .filter(Boolean)
    .reduce<string[]>((acc, word) => {
      if (/^[?:!;»]$/.test(word) && acc.length > 0) {
        acc[acc.length - 1] += ` ${word}`;
      } else {
        acc.push(word);
      }
      return acc;
    }, []);
}

function titleSize(length: number): number {
  if (length <= 28) return 88;
  if (length <= 52) return 74;
  if (length <= 84) return 62;
  return 54;
}

function Cross({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - 6,
        top: y - 6,
        width: 13,
        height: 13,
        display: "flex",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 6,
          top: 0,
          width: 1,
          height: 13,
          background: COLORS.lineStrong,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 6,
          width: 13,
          height: 1,
          background: COLORS.lineStrong,
        }}
      />
    </div>
  );
}

function Frame() {
  const right = OG_SIZE.width - RAIL;
  const bottom = OG_SIZE.height - BAND;
  return (
    <>
      {[RAIL, right].map((x) => (
        <div
          key={x}
          style={{
            position: "absolute",
            left: x,
            top: 0,
            width: 1,
            height: OG_SIZE.height,
            background: COLORS.line,
          }}
        />
      ))}
      {[BAND, bottom].map((y) => (
        <div
          key={y}
          style={{
            position: "absolute",
            left: RAIL,
            top: y,
            width: right - RAIL,
            height: 1,
            background: COLORS.line,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: RAIL - 1,
          top: 170,
          width: 3,
          height: 230,
          backgroundImage: `linear-gradient(to bottom, rgba(245,78,0,0), ${COLORS.accent}, rgba(245,78,0,0))`,
        }}
      />
      {[RAIL, right].flatMap((x) =>
        [BAND, bottom].map((y) => <Cross key={`${x}-${y}`} x={x} y={y} />),
      )}
    </>
  );
}

export async function renderOg({
  title,
  emphasis,
}: {
  title: string;
  emphasis?: string;
}) {
  const [regular, semibold, grain] = await Promise.all([
    asset("fonts/geist-400.ttf"),
    asset("fonts/geist-600.ttf"),
    grainDataUrl(),
  ]);
  const tokens = [
    ...words(title).map((word) => ({ word, color: COLORS.text })),
    ...words(emphasis).map((word) => ({ word, color: COLORS.text2 })),
  ];
  const size = titleSize(tokens.map(({ word }) => word).join(" ").length);

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
        fontFamily: "Geist",
      }}
    >
      <Frame />
      <div
        style={{
          position: "absolute",
          left: CONTENT_X,
          right: CONTENT_X,
          top: 0,
          height: BAND,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="38" height="38" viewBox="0 0 900 900">
            <path
              transform="translate(49.5 829.5) scale(0.1 -0.1)"
              d={KLYX_MARK_PATH}
              fill={COLORS.text}
            />
          </svg>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            {site.name}
          </div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 400, color: COLORS.text3 }}>
          {site.url.replace("https://", "")}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: CONTENT_X,
          right: CONTENT_X,
          top: BAND,
          bottom: BAND,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: size,
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: "-0.042em",
          }}
        >
          {tokens.map(({ word, color }, i) => (
            <span key={i} style={{ color, marginRight: size * 0.2 }}>
              {word}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: CONTENT_X,
          right: CONTENT_X,
          bottom: 0,
          height: BAND,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 24,
          fontWeight: 400,
          color: COLORS.text2,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: COLORS.accent,
          }}
        />
        {site.city}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
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

export function ogLocaleParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export function pageOgImage(namespace: string) {
  return async function OpengraphImage({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const t = getStaticTranslator(await resolveOgLocale(params), namespace);
    const hero = t.raw("hero");
    const split =
      typeof hero === "object" && hero !== null && "titleEmphasis" in hero;
    return renderOg({
      title: t("hero.title"),
      emphasis: split ? t("hero.titleEmphasis") : undefined,
    });
  };
}
