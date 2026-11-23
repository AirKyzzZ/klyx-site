import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { JsonLd } from "@/components/json-ld";
import { FlowRow } from "@/components/ui-kit/flow-row";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { SiteCta } from "@/components/ui-kit/site-cta";
import { SplitHero } from "@/components/ui-kit/split-hero";
import { UseCaseCard } from "@/components/ui-kit/use-case-card";
import type { Translate } from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { trailPageJsonLd } from "@/lib/json-ld";
import { getOfferCopy } from "@/lib/offer-copy";
import { formatPrice, getOfferPrice, getPriceValues } from "@/lib/offers";
import { COMMON_TASKS, SECTOR_KEYS, sectorPages } from "@/lib/sector-pages";
import { buildMetadata } from "@/lib/seo";

const textLink =
  "text-text hover:text-accent-text inline-flex w-fit items-center gap-1.5 text-[0.9375rem] font-medium underline decoration-1 underline-offset-[3px] transition-colors duration-(--d-fast)";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.useCases" });
  return buildMetadata({
    locale,
    pathname: "/cas-usage",
    title: t("title"),
    description: t("description"),
  });
}

export default async function UseCasesPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "useCases" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const offersT = (await getTranslations({
    locale,
    namespace: "offers",
  })) as Translate;
  const prices = getPriceValues(locale);

  return (
    <>
      <JsonLd
        data={trailPageJsonLd({
          locale,
          trail: [{ name: nav("useCases"), pathname: "/cas-usage" }],
        })}
      />

      <SplitHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle", prices)}
        actions={
          <>
            <ActionButton action="book" size="xl" trackLocation="hero">
              {t("labels.book")}
            </ActionButton>
            <ActionButton
              action="quote"
              variant="outline"
              size="xl"
              trackLocation="hero"
            >
              {t("labels.quote")}
            </ActionButton>
          </>
        }
        aside={
          <nav
            aria-label={nav("useCases")}
            className="border-line bg-surface-1 shadow-panel divide-line flex flex-col divide-y overflow-hidden rounded-[20px] border"
          >
            {SECTOR_KEYS.map((key) => {
              const config = sectorPages[key];
              return (
                <Link
                  key={key}
                  href={config.pathname}
                  className="group hover:bg-surface-2 flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-(--d-fast) sm:px-6"
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="text-text font-medium">{nav(key)}</span>
                    <span className="text-text-3 text-[0.8125rem]">
                      {t("labels.from")}{" "}
                      {formatPrice(getOfferPrice(config.anchor), locale)}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="text-text-3 group-hover:text-text size-4 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
                  />
                </Link>
              );
            })}
          </nav>
        }
      />

      <PageSection id="secteurs">
        <SectionHeader title={t("sectors.title")} intro={t("sectors.intro")} />
        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {SECTOR_KEYS.map((key) => {
            const config = sectorPages[key];
            const anchor = getOfferCopy(offersT, locale, config.anchor);
            return (
              <li key={key}>
                <Link
                  href={config.pathname}
                  data-sector-card
                  className="group border-line bg-surface-1 shadow-panel hover:border-line-strong flex h-full flex-col gap-5 rounded-[16px] border p-6 transition-colors duration-(--d-fast) sm:p-7"
                >
                  <div
                    aria-hidden="true"
                    className="bg-surface-2 overflow-hidden rounded-[12px] p-4"
                  >
                    <FlowRow
                      from={config.flow.from}
                      to={config.flow.to}
                      agentLabel={t("labels.agentPill")}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <h3 className="text-text text-[1.375rem] leading-tight font-semibold tracking-[-0.5px]">
                      {nav(key)}
                    </h3>
                    <p className="text-text-2 text-[0.9375rem] leading-normal">
                      {t(`${key}.card.problem`)}
                    </p>
                    <p className="text-text text-[0.9375rem] leading-normal">
                      {t(`${key}.card.build`)}
                    </p>
                  </div>
                  <div className="border-line flex flex-wrap items-end justify-between gap-4 border-t pt-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-text-3 text-[0.8125rem]">
                        {t("labels.from")}
                      </p>
                      <p className="text-text text-2xl leading-none font-semibold tracking-[-0.8px]">
                        {formatPrice(getOfferPrice(config.anchor), locale)}
                      </p>
                      <p className="text-text-2 pt-1 text-sm">{anchor.name}</p>
                    </div>
                    <span className="text-accent-text inline-flex items-center gap-1 text-sm font-medium">
                      {t("labels.see")}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-3.5 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </PageSection>

      <PageSection id="taches">
        <SectionHeader title={t("common.title")} intro={t("common.intro")}>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/faq" className={textLink}>
              {t("common.faq")}
            </Link>
            <Link href="/tarifs" className={textLink}>
              {t("labels.allPricing")}
            </Link>
          </div>
        </SectionHeader>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {COMMON_TASKS.map(({ id, from, to }) => (
            <UseCaseCard
              key={id}
              category={t(`common.items.${id}.category`)}
              title={t(`common.items.${id}.title`)}
              from={from}
              to={to}
              agentLabel={t("labels.agentPill")}
              before={{
                label: t("labels.before"),
                text: t(`common.items.${id}.before`),
              }}
              after={{
                label: t("labels.after"),
                text: t(`common.items.${id}.after`),
              }}
            />
          ))}
        </div>
      </PageSection>

      <SiteCta title={t("cta.title")} body={t("cta.body")} />
    </>
  );
}
