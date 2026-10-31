import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { CaseGrid } from "@/components/sections/case-grid";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getCaseStudies } from "@/lib/content";
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
      <Background>
        <Hero
          title={t("hero.title")}
          emphasis={t("hero.titleEmphasis")}
          subtitle={t("hero.subtitle")}
        />
      </Background>

      <CaseGrid
        items={cases}
        readLabel={t("labels.read")}
        className="pt-16 lg:pt-20"
      />

      <Background variant="bottom">
        <Cta
          title={t("cta.title")}
          body={t("cta.body")}
          primary={{ action: "book", label: t("cta.ctaPrimary") }}
          secondary={{ action: "quote", label: t("cta.ctaSecondary") }}
        />
      </Background>
    </>
  );
}
