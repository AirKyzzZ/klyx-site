import type { Metadata } from "next";

import { ArrowUpRight, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Section, SectionHeading } from "@/components/section";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { PriceLedger } from "@/components/sections/price-ledger";
import { SampleWindow } from "@/components/sections/process-timeline";
import {
  messageKeys,
  messageList,
  messageStrings,
  type Translate,
} from "@/i18n/message-list";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getCaseStudies } from "@/lib/content";
import { getOfferCopy } from "@/lib/offer-copy";
import { MARKET_KLYX_OFFER } from "@/lib/offers";
import { getSiteShot } from "@/lib/proof";
import { buildMetadata } from "@/lib/seo";

const MARKET_CHECKED_AT = "2026-10-31";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.pricing" });
  return buildMetadata({
    locale,
    pathname: "/tarifs",
    title: t("title"),
    description: t("description"),
  });
}

export default async function PricingPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = (await getTranslations({
    locale,
    namespace: "pricing",
  })) as Translate;
  const offersT = (await getTranslations({
    locale,
    namespace: "offers",
  })) as Translate;
  const [firstCase] = await getCaseStudies(locale);
  const marketRows = messageKeys(t.raw("market.card.rows"));

  return (
    <>
      <Hero
        title={t("hero.title")}
        emphasis={t("hero.titleEmphasis")}
        serif={t("hero.serif")}
        subtitle={t("hero.subtitle")}
        meta={offersT("vatNote")}
        aside={
          <div className="border-line border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <h2 className="type-label text-text-3">{t("guarantees.title")}</h2>
            <ul className="type-data mt-4 space-y-3">
              {messageStrings(t, "guarantees.items").map((item) => (
                <li key={item} className="text-text-2 flex gap-3">
                  <Check
                    aria-hidden="true"
                    className="text-text mt-1 size-3.5 shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <PriceLedger locale={locale} />
      </Hero>

      <Section index="01" eyebrow={t("eyebrows.market")}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="reveal lg:col-span-5">
            <SectionHeading lead={t("market.title")} />
            <p className="text-text-2 mt-6 max-w-[52ch]">{t("market.body")}</p>
          </div>
          <div className="reveal lg:col-span-6 lg:col-start-7">
            <SampleWindow
              file={t("market.card.title")}
              sample={MARKET_CHECKED_AT}
            >
              <table className="w-full text-left">
                <thead className="max-sm:sr-only">
                  <tr className="text-text-3 border-line border-b">
                    <th scope="col" className="pr-3 pb-3 font-normal">
                      {t("market.card.columns.item")}
                    </th>
                    <th scope="col" className="pr-3 pb-3 font-normal">
                      {t("market.card.columns.market")}
                    </th>
                    <th scope="col" className="pb-3 font-normal">
                      {t("market.card.columns.klyx")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {marketRows.map((key) => {
                    const row = `market.card.rows.${key}`;
                    const klyx = getOfferCopy(
                      offersT,
                      locale,
                      MARKET_KLYX_OFFER[key],
                    );
                    const url = messageKeys(t.raw(row)).includes("url")
                      ? t(`${row}.url`)
                      : null;
                    return (
                      <tr
                        key={key}
                        className="border-line border-b align-top last:border-b-0 max-sm:flex max-sm:flex-col max-sm:gap-1 max-sm:py-4"
                      >
                        <th
                          scope="row"
                          className="text-text py-4 pr-3 font-sans text-sm font-medium max-sm:py-0"
                        >
                          {t(`${row}.label`)}
                          <span className="text-text-3 mt-1 block font-mono text-xs font-normal">
                            {url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener"
                                className="hover:text-text inline-flex items-center gap-1 underline underline-offset-4 transition-colors"
                              >
                                {t(`${row}.source`)}
                                <ArrowUpRight
                                  aria-hidden="true"
                                  className="size-3"
                                />
                              </a>
                            ) : (
                              t(`${row}.source`)
                            )}
                          </span>
                        </th>
                        <td className="text-text-2 py-4 pr-3 whitespace-nowrap max-sm:py-0">
                          <span className="text-text-3 sm:hidden">
                            {t("market.card.columns.market")}{" "}
                          </span>
                          {t(`${row}.range`)}
                        </td>
                        <td className="text-text py-4 max-sm:py-0">
                          <span className="text-text-3 sm:hidden">
                            {t("market.card.columns.klyx")}{" "}
                          </span>
                          {klyx.price}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="border-line text-text-3 mt-2 border-t pt-4 text-xs">
                {t("market.card.note")}
              </p>
            </SampleWindow>
          </div>
        </div>
      </Section>

      <Faq
        index="02"
        eyebrow={t("eyebrows.faq")}
        title={t("faq.title")}
        items={messageList(t, "faq.items", ["question", "answer"])}
        bookLabel={t("cta.ctaSecondary")}
        openFirst
      />

      <Cta
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ action: "quote", label: t("cta.ctaPrimary") }}
        secondary={{ action: "book", label: t("cta.ctaSecondary") }}
        shot={firstCase ? getSiteShot(firstCase.slug) : null}
      />
    </>
  );
}
