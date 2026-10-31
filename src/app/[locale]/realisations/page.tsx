import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ChamferBreak } from "@/components/chamfer-break";
import { Section } from "@/components/section";
import { BAND_X, CaseCard } from "@/components/sections/case-grid";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { caseYears, getCaseStudies } from "@/lib/content";
import { getSiteShot } from "@/lib/proof";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

function caseSpan(index: number, total: number): "wide" | "7" | "5" {
  if (index === total - 1 && total % 2 === 1) return "wide";
  const row = Math.floor(index / 2);
  const first = index % 2 === 0;
  return (row % 2 === 0) === first ? "7" : "5";
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.cases" });
  return buildMetadata({
    locale,
    pathname: "/realisations",
    title: t("title"),
    description: t("description"),
  });
}

export default async function CasesPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "cases" });
  const cases = await getCaseStudies(locale);

  return (
    <>
      <Hero
        title={t("hero.title")}
        emphasis={t("hero.titleEmphasis")}
        serif={t("hero.serif")}
        subtitle={t("hero.subtitle")}
        meta={t("count", { count: cases.length, years: caseYears(cases) })}
      />

      <ChamferBreak edge="top" />
      <Section tone="sand" index="01" eyebrow={t("eyebrow")}>
        <ul className="grid gap-x-6 gap-y-14 lg:grid-cols-12 lg:gap-y-20">
          {cases.map((item, i) => {
            const span = caseSpan(i, cases.length);
            return (
              <li
                key={item.slug}
                className={cn(
                  "reveal",
                  span === "wide" && "lg:col-span-12",
                  span === "7" && "lg:col-span-7",
                  span === "5" && "lg:col-span-5",
                )}
              >
                <CaseCard
                  item={item}
                  readLabel={t("labels.read")}
                  layout={span === "wide" ? "wide" : "stack"}
                  device={span === "5" ? "mobile" : "desktop"}
                  bandX={BAND_X[i % BAND_X.length]}
                  sizes={
                    span === "5"
                      ? "(min-width: 1024px) 420px, 90vw"
                      : "(min-width: 1024px) 680px, 90vw"
                  }
                  coverClassName={
                    span === "wide" ? undefined : "lg:aspect-auto lg:h-[400px]"
                  }
                />
              </li>
            );
          })}
        </ul>
      </Section>
      <ChamferBreak edge="bottom" />

      <Cta
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ action: "book", label: t("cta.ctaPrimary") }}
        secondary={{ action: "quote", label: t("cta.ctaSecondary") }}
        shot={cases[0] ? getSiteShot(cases[0].slug) : null}
      />
    </>
  );
}
