import type { CSSProperties, ReactNode } from "react";

import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { EmphasisTitle } from "@/components/emphasis-title";
import { FoldStrip } from "@/components/fold-strip";
import { LiveSystem } from "@/components/live-system/live-system";
import { Tag } from "@/components/tag";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

export type HeroAction = { action: "book" | "quote"; label: string };

type HeroProps = {
  eyebrow?: ReactNode;
  title: string;
  emphasis?: string;
  serif?: string;
  subtitle?: string;
  meta?: ReactNode;
  primary?: HeroAction;
  secondary?: HeroAction;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function Hero({
  eyebrow,
  title,
  emphasis,
  serif,
  subtitle,
  meta,
  primary,
  secondary,
  aside,
  children,
  className,
}: HeroProps) {
  return (
    <section
      className={cn("relative pt-24 pb-16 md:pt-28 md:pb-20", className)}
    >
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div className={aside ? "lg:col-span-7" : "lg:col-span-10"}>
            {eyebrow && (
              <div className="hero-in type-label text-text-3" style={delay(0)}>
                {eyebrow}
              </div>
            )}
            <h1 className={cn("type-h1 max-w-[20ch]", eyebrow && "mt-4")}>
              <EmphasisTitle title={title} emphasis={emphasis} serif={serif} />
            </h1>
            {subtitle && (
              <p
                className="hero-in type-lead text-text-2 mt-5 max-w-[56ch]"
                style={delay(0.15)}
              >
                {subtitle}
              </p>
            )}
            {meta && (
              <div
                className="hero-in type-label text-text-3 mt-5"
                style={delay(0.22)}
              >
                {meta}
              </div>
            )}
            {(primary || secondary) && (
              <div
                className="hero-in mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
                style={delay(0.3)}
              >
                {primary && (
                  <ActionButton
                    action={primary.action}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {primary.label}
                  </ActionButton>
                )}
                {secondary && (
                  <ActionButton
                    action={secondary.action}
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {secondary.label}
                    <ArrowRight />
                  </ActionButton>
                )}
              </div>
            )}
          </div>
          {aside && (
            <div
              className="hero-in lg:col-span-4 lg:col-start-9"
              style={delay(0.38)}
            >
              {aside}
            </div>
          )}
        </div>
        {children && (
          <div className="hero-in mt-12 md:mt-16" style={delay(0.45)}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

const HOME_SCENARIOS = ["agents", "sites", "fde"] as const;

export async function HomeHero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const tabs = await getTranslations({ locale, namespace: "liveSystem.tabs" });

  return (
    <section data-home-hero className="relative pt-28 pb-16 md:pb-24">
      <div className="container">
        <div>
          <p className="hero-in type-label text-text-3" style={delay(0)}>
            {t("eyebrow")}
          </p>
          <h1 className="type-display mt-4">
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
          className="hero-in mt-6"
          style={delay(0.45)}
        />
        <div className="hero-in mt-10 md:mt-6" style={delay(0.6)}>
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
