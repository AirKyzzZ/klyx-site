import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { CaseList } from "@/components/sections/case-grid";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { SiteCta } from "@/components/ui-kit/site-cta";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getCaseStudies } from "@/lib/content";
import { caseListJsonLd } from "@/lib/json-ld";
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
      <JsonLd data={caseListJsonLd(locale, cases)} />
      <PageSection
        id="hero"
        divider={false}
        containerClassName="pt-32 md:pt-40 lg:pt-44"
      >
        <SectionHeader
          as="h1"
          title={t("hero.title")}
          intro={t("hero.subtitle")}
        />
        <CaseList
          items={cases}
          readLabel={t("labels.read")}
          className="mt-12 lg:mt-16"
        />
      </PageSection>

      <SiteCta
        title={t("cta.title")}
        body={t("cta.body")}
        secondaryLabel={t("cta.secondary")}
      />
    </>
  );
}
