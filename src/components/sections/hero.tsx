import type { CSSProperties, ReactNode } from "react";

import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { DashedLine } from "@/components/dashed-line";
import { EmphasisTitle } from "@/components/emphasis-title";
import { FoldStrip } from "@/components/fold-strip";
import { LiveSystem } from "@/components/live-system/live-system";
import { Tag } from "@/components/tag";
import type { Locale } from "@/i18n/routing";

export type HeroAction = { action: "book" | "quote"; label: string };

type HeroProps = {
  eyebrow?: string;
  title: string;
  emphasis?: string;
  subtitle: string;
  primary?: HeroAction;
  secondary?: HeroAction;
  aside?: ReactNode;
};

export function Hero({
  eyebrow,
  title,
  emphasis,
  subtitle,
  primary,
  secondary,
  aside,
}: HeroProps) {
  return (
    <section className="pt-36 pb-20 lg:pt-48 lg:pb-28">
      <div className="container flex flex-col justify-between gap-10 md:gap-14 lg:flex-row lg:gap-20">
        <div className="flex-[1.5]">
          {eyebrow && (
            <p className="text-muted-foreground mb-5 font-mono text-xs tracking-wider uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="text-foreground max-w-3xl text-4xl leading-[1.05] tracking-tight text-balance md:text-5xl lg:text-6xl">
            <EmphasisTitle title={title} emphasis={emphasis} />
          </h1>

          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-snug text-balance md:text-xl lg:text-2xl">
            {subtitle}
          </p>

          {(primary || secondary) && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {primary && (
                <ActionButton action={primary.action} size="lg">
                  {primary.label}
                </ActionButton>
              )}
              {secondary && (
                <ActionButton
                  action={secondary.action}
                  variant="secondary"
                  size="lg"
                >
                  {secondary.label}
                  <ArrowRight className="stroke-3" />
                </ActionButton>
              )}
            </div>
          )}
        </div>

        {aside && (
          <div className="relative flex flex-1 flex-col justify-center max-lg:pt-10 lg:pl-10">
            <DashedLine
              orientation="vertical"
              className="absolute top-0 left-0 max-lg:hidden"
            />
            <DashedLine
              orientation="horizontal"
              className="absolute top-0 lg:hidden"
            />
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}

type HeroListItem = {
  title: string;
  body?: string;
  meta?: string;
};

export function HeroList({ items }: { items: HeroListItem[] }) {
  return (
    <ul className="space-y-6">
      {items.map((item) => (
        <li key={item.title} className="flex gap-3 lg:gap-5">
          <span
            aria-hidden="true"
            className="bg-foreground mt-2 size-1.5 shrink-0 rounded-full"
          />
          <div>
            <p className="font-text text-foreground font-semibold">
              {item.title}
            </p>
            {item.meta && (
              <p className="text-foreground mt-0.5 font-mono text-sm">
                {item.meta}
              </p>
            )}
            {item.body && (
              <p className="text-muted-foreground mt-0.5 max-w-80 text-sm">
                {item.body}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

const HOME_SCENARIOS = ["agents", "sites", "fde"] as const;

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

export async function HomeHero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const tabs = await getTranslations({ locale, namespace: "liveSystem.tabs" });

  return (
    <section className="relative pt-24 pb-16 md:pt-28 md:pb-24">
      <div className="container">
        <div className="max-w-[52rem]">
          <p className="hero-in type-label text-text-3" style={delay(0)}>
            {t("eyebrow")}
          </p>
          <h1 className="type-display mt-4 max-w-[22ch]">
            <EmphasisTitle
              title={t("title")}
              emphasis={t("titleEmphasis")}
              serif={t("serif")}
            />
          </h1>
          <p
            className="hero-in type-lead text-text-2 mt-5 max-w-[58ch]"
            style={delay(0.15)}
          >
            {t("subtitle")}{" "}
            <span className="inline-flex flex-wrap gap-1.5 align-middle">
              {HOME_SCENARIOS.map((id) => (
                <Tag key={id}>{tabs(id)}</Tag>
              ))}
            </span>
          </p>
          <div
            className="hero-in mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={delay(0.3)}
          >
            <ActionButton action="book" size="lg" className="w-full sm:w-auto">
              {t("ctaPrimary")}
            </ActionButton>
            <ActionButton
              action="quote"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {t("ctaSecondary")}
              <ArrowRight />
            </ActionButton>
          </div>
        </div>
        <FoldStrip
          locale={locale}
          className="hero-in mt-8"
          style={delay(0.5)}
        />
        <div className="hero-in mt-10 md:mt-12" style={delay(0.6)}>
          <LiveSystem
            scenarioIds={[...HOME_SCENARIOS]}
            initial="agents"
            priority
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
