import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { EmphasisTitle } from "@/components/emphasis-title";
import { JsonLd } from "@/components/json-ld";
import { Section, SectionHeading } from "@/components/section";
import { Cta } from "@/components/sections/cta";
import type { Translate } from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { trailPageJsonLd } from "@/lib/json-ld";
import { getOfferCopy } from "@/lib/offer-copy";
import { getPriceValues } from "@/lib/offers";
import { SECTOR_KEYS, sectorPages } from "@/lib/sector-pages";
import { buildMetadata } from "@/lib/seo";

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

      <section
        data-shot="hero"
        className="relative pt-28 pb-12 md:pt-36 md:pb-16"
      >
        <div className="container">
          <p className="hero-in type-label text-text-3">{t("hero.eyebrow")}</p>
          <h1 className="type-h1 mt-4 max-w-[20ch]">
            <EmphasisTitle
              title={t("hero.title")}
              emphasis={t("hero.titleEmphasis")}
              serif={t("hero.serif")}
            />
          </h1>
          <p className="hero-in type-lead text-text-2 mt-5 max-w-[60ch]">
            {t("hero.subtitle", prices)}
          </p>
          <div className="hero-in mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ActionButton action="book" size="lg" className="w-full sm:w-auto">
              {t("hero.ctaPrimary")}
            </ActionButton>
            <ActionButton
              action="quote"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {t("hero.ctaSecondary")}
              <ArrowRight />
            </ActionButton>
          </div>
        </div>
      </section>

      <Section index="01" eyebrow={t("eyebrows.sectors")}>
        <div className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            lead={t("sectors.title")}
            rest={t("sectors.titleEmphasis")}
            className="lg:col-span-7"
          />
          <p className="text-text-2 max-w-[44ch] lg:col-span-4 lg:col-start-9">
            {t("sectors.body")}
          </p>
        </div>
        <ol className="reveal border-line mt-12 border-t md:mt-16">
          {SECTOR_KEYS.map((key, i) => {
            const config = sectorPages[key];
            const anchor = getOfferCopy(offersT, locale, config.anchor);
            return (
              <li key={key} className="border-line border-b">
                <Link
                  href={config.pathname}
                  className="group hover:bg-surface-1 grid gap-4 py-7 transition-colors duration-(--d-fast) md:grid-cols-12 md:gap-6 md:px-4"
                >
                  <div className="md:col-span-3">
                    <p className="type-label text-text-3">
                      <span className="text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>{" "}
                      / {t(`${key}.hero.eyebrow`)}
                    </p>
                    <h3 className="type-h3 mt-3">{nav(key)}</h3>
                  </div>
                  <div className="md:col-span-3">
                    <p className="type-label text-text-3">
                      {t("labels.problem")}
                    </p>
                    <p className="text-text-2 mt-2 text-[0.9375rem] leading-normal">
                      {t(`${key}.card.problem`)}
                    </p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="type-label text-text-3">
                      {t("labels.build")}
                    </p>
                    <p className="text-text-2 mt-2 text-[0.9375rem] leading-normal">
                      {t(`${key}.card.build`)}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between gap-4 md:col-span-3 md:items-end md:text-right">
                    <div>
                      <p className="type-label text-text-3">
                        {t("labels.price")}
                      </p>
                      <p className="type-data text-text mt-2">{anchor.price}</p>
                      <p className="type-data text-text-3 text-[0.8125rem]">
                        {anchor.name}
                      </p>
                    </div>
                    <span className="text-text inline-flex items-center gap-1.5 text-sm font-medium">
                      {t("labels.see")}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section index="02" eyebrow={t("eyebrows.other")}>
        <div className="reveal grid gap-8 lg:grid-cols-12 lg:gap-6">
          <SectionHeading
            lead={t("other.title")}
            rest={t("other.titleEmphasis")}
            className="lg:col-span-5"
          />
          <div className="space-y-6 lg:col-span-6 lg:col-start-7">
            <p className="text-text-2 max-w-[56ch]">{t("other.body")}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {(
                [
                  { href: "/faq", label: t("other.faq") },
                  { href: "/tarifs", label: t("other.pricing") },
                ] as const
              ).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group text-text-2 hover:text-text inline-flex items-center gap-1.5 transition-colors"
                >
                  {link.label}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>

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
