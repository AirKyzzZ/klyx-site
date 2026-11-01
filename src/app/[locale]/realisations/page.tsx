import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ChamferBreak } from "@/components/chamfer-break";
import { Section } from "@/components/section";
import { CaseList } from "@/components/sections/case-grid";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { SampleWindow } from "@/components/sections/process-timeline";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { caseYears, getCaseStudies } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

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
        aside={
          <SampleWindow file={t("hero.window")}>
            <ul className="space-y-1">
              {cases.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={{
                      pathname: "/realisations/[slug]",
                      params: { slug: item.slug },
                    }}
                    className="hover:bg-surface-3 -mx-2 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 rounded-xs px-2 py-1.5 transition-colors"
                  >
                    <span className="text-text truncate">{item.slug}.mdx</span>
                    <span className="text-text-3">
                      {item.year} · {item.stack.join(", ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </SampleWindow>
        }
      />

      <ChamferBreak edge="top" />
      <Section tone="sand" index="01" eyebrow={t("eyebrow")}>
        <CaseList items={cases} readLabel={t("labels.read")} />
      </Section>
      <ChamferBreak edge="bottom" />

      <Cta
        title={t("cta.title")}
        emphasis={t("cta.titleEmphasis")}
        body={t("cta.body")}
        primary={{ action: "book", label: t("cta.ctaPrimary") }}
        secondary={{ action: "quote", label: t("cta.ctaSecondary") }}
      />
    </>
  );
}
