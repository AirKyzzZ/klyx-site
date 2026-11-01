import type { Metadata } from "next";

import { ArrowUpRight, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { PriceLedger } from "@/components/sections/price-ledger";
import {
  messageList,
  messageStrings,
  type Translate,
} from "@/i18n/message-list";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getPriceValues } from "@/lib/offers";
import { buildMetadata } from "@/lib/seo";

const MARKET_ROW = "tjm";

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
            <ul className="mt-4 space-y-3 text-[0.9375rem] leading-snug">
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
        <p className="text-text-3 mt-6 max-w-[72ch] text-sm leading-relaxed">
          {t("market.line", getPriceValues(locale))}{" "}
          <a
            href={t(`market.card.rows.${MARKET_ROW}.url`)}
            target="_blank"
            rel="noopener"
            className="hover:text-text inline-flex items-center gap-1 underline underline-offset-4 transition-colors"
          >
            {t("market.sourceLabel")}
            <ArrowUpRight aria-hidden="true" className="size-3" />
          </a>
        </p>
      </Hero>

      <Faq
        index="01"
        eyebrow={t("eyebrows.faq")}
        title={t("faq.title")}
        emphasis={t("faq.titleEmphasis")}
        items={messageList(t, "faq.items", ["question", "answer"])}
        bookLabel={t("cta.ctaSecondary")}
        openFirst
      />

      <Cta
        title={t("cta.title")}
        emphasis={t("cta.titleEmphasis")}
        body={t("cta.body")}
        primary={{ action: "quote", label: t("cta.ctaPrimary") }}
        secondary={{ action: "book", label: t("cta.ctaSecondary") }}
      />
    </>
  );
}
