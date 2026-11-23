import type { Metadata } from "next";

import {
  ArrowUpRight,
  BookOpen,
  Bot,
  CodeXml,
  FileText,
  KeyRound,
  MessageCircle,
  Tag,
  UserRound,
  UsersRound,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { JsonLd } from "@/components/json-ld";
import { hostOf } from "@/components/proof/shot-frame";
import { CaseCard } from "@/components/sections/case-grid";
import { FounderPanel } from "@/components/sections/founder-panel";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { SiteCta } from "@/components/ui-kit/site-cta";
import { TrustGrid } from "@/components/ui-kit/trust-grid";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getCaseStudies } from "@/lib/content";
import { aboutPageJsonLd } from "@/lib/json-ld";
import { getPriceValues } from "@/lib/offers";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const TEAM = [
  { key: "lead", icon: UserRound },
  { key: "agents", icon: Bot },
  { key: "specialists", icon: UsersRound },
] as const;

const FACTS = ["company", "location", "languages", "tools"] as const;

const TRUST = [
  { key: "code", icon: CodeXml },
  { key: "prices", icon: Tag },
  { key: "quote", icon: FileText },
  { key: "owned", icon: KeyRound },
  { key: "handover", icon: BookOpen },
  { key: "honest", icon: MessageCircle },
] as const;

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return buildMetadata({
    locale,
    pathname: "/a-propos",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "about" });
  const cases = await getTranslations({ locale, namespace: "cases.labels" });
  const prices = getPriceValues(locale);
  const citeme = (await getCaseStudies(locale)).find(
    (study) => study.slug === "citeme",
  );
  const sisterText: Partial<
    Record<(typeof site.sisterSites)[number]["name"], string>
  > = {
    "Klyx Estate": t("products.estate"),
  };

  return (
    <>
      <JsonLd data={aboutPageJsonLd(locale)} />
      <PageSection
        id="hero"
        divider={false}
        containerClassName="pt-32 md:pt-40 lg:pt-44"
      >
        <SectionHeader
          as="h1"
          title={t("hero.title")}
          intro={t("hero.subtitle")}
        >
          <div className="grid gap-3 sm:max-lg:flex sm:max-lg:flex-wrap">
            <ActionButton action="book" size="xl" trackLocation="hero">
              {t("hero.ctaPrimary")}
            </ActionButton>
            <Button variant="outline" size="xl" asChild>
              <Link href="/realisations">{t("hero.ctaSecondary")}</Link>
            </Button>
          </div>
        </SectionHeader>
        <FounderPanel locale={locale} className="mt-12 lg:mt-16" />
      </PageSection>

      <PageSection id="equipe">
        <SectionHeader title={t("team.title")} intro={t("team.intro")} />
        <ul className="mt-12 grid gap-5 md:grid-cols-3 lg:gap-6">
          {TEAM.map(({ key, icon: Icon }) => (
            <li
              key={key}
              className="border-line bg-surface-1 shadow-panel flex flex-col gap-3.5 rounded-[16px] border p-6 sm:p-8"
            >
              <span className="bg-accent-tint text-accent grid size-10 place-items-center rounded-[10px]">
                <Icon
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.75}
                />
              </span>
              <h3 className="text-text text-lg leading-tight font-semibold tracking-[-0.3px]">
                {t(`team.items.${key}.title`)}
              </h3>
              <p className="text-text-2 text-[0.9375rem] leading-[1.55]">
                {t(`team.items.${key}.body`)}
              </p>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="histoire">
        <SectionHeader title={t("story.title")} intro={t("story.entity")}>
          <p className="type-intro text-text-2">{t("story.intro")}</p>
          <p className="type-intro text-text-2">{t("story.body")}</p>
        </SectionHeader>
        <dl className="border-line bg-line mt-12 grid gap-px overflow-hidden rounded-[16px] border sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((key) => (
            <div
              key={key}
              className="bg-surface-1 flex flex-col gap-1.5 px-6 py-5 sm:px-8 sm:py-6"
            >
              <dt className="text-text-3 text-[0.8125rem]">
                {t(`story.facts.${key}.label`)}
              </dt>
              <dd className="text-text text-base font-medium">
                {t(`story.facts.${key}.value`)}
              </dd>
            </div>
          ))}
        </dl>
      </PageSection>

      {citeme && (
        <PageSection id="produits">
          <SectionHeader
            title={t("products.title")}
            intro={t("products.citeme")}
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-6">
            <CaseCard
              item={citeme}
              readLabel={cases("read")}
              sizes="(min-width: 1024px) 640px, 90vw"
            />
            <div className="border-line bg-surface-1 flex flex-col self-start rounded-[20px] border p-6 sm:p-8">
              <h3 className="text-text text-lg leading-tight font-semibold tracking-[-0.3px]">
                {t("products.lines")}
              </h3>
              <ul className="mt-4 flex flex-col">
                {site.sisterSites.map((sister) => (
                  <li
                    key={sister.url}
                    className="border-line flex flex-col gap-1.5 border-t py-5 last:pb-0"
                  >
                    <a
                      href={sister.url}
                      target="_blank"
                      rel="noopener"
                      className="group text-text hover:text-accent-text flex items-center justify-between gap-3 font-medium transition-colors duration-(--d-fast)"
                    >
                      {sister.name}
                      <span className="text-text-3 group-hover:text-accent-text inline-flex items-center gap-1.5 text-[0.8125rem] font-normal">
                        {hostOf(sister.url)}
                        <ArrowUpRight aria-hidden="true" className="size-3.5" />
                      </span>
                    </a>
                    {sisterText[sister.name] && (
                      <p className="text-text-2 text-[0.9375rem] leading-normal">
                        {sisterText[sister.name]}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageSection>
      )}

      <PageSection id="confiance">
        <SectionHeader title={t("trust.title")} intro={t("trust.intro")}>
          <Button
            variant="outline"
            asChild
            className="h-11 self-start rounded-[10px] px-5"
          >
            <Link href="/tarifs">{t("trust.pricing")}</Link>
          </Button>
        </SectionHeader>
        <TrustGrid
          className="mt-12"
          items={TRUST.map(({ key, icon }) => ({
            icon,
            title: t(`trust.items.${key}.title`),
            body: t(`trust.items.${key}.body`, prices),
          }))}
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
