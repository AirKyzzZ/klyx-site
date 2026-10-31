import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Hero, HeroList } from "@/components/sections/hero";
import { PriceTable } from "@/components/sections/price-table";
import { Statement } from "@/components/sections/statement";
import { messageList, messageStrings } from "@/i18n/message-list";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getOfferCopy } from "@/lib/offer-copy";
import type { OfferId } from "@/lib/offers";
import { buildMetadata } from "@/lib/seo";

const GROUPS: { key: "sites" | "ai" | "fde"; offers: OfferId[] }[] = [
  { key: "sites", offers: ["landing", "site-ia", "site-custom"] },
  { key: "ai", offers: ["audit-ia", "sprint-ia", "retainer"] },
  { key: "fde", offers: ["fde"] },
];

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
  const t = await getTranslations({ locale, namespace: "pricing" });
  const offersT = await getTranslations({ locale, namespace: "offers" });

  return (
    <>
      <Background>
        <Hero
          title={t("hero.title")}
          emphasis={t("hero.titleEmphasis")}
          subtitle={t("hero.subtitle")}
          primary={{ action: "quote", label: t("cta.ctaPrimary") }}
          secondary={{ action: "book", label: t("cta.ctaSecondary") }}
          aside={
            <div className="space-y-5">
              <h2 className="font-text text-muted-foreground font-mono text-xs tracking-wider uppercase">
                {t("guarantees.title")}
              </h2>
              <HeroList
                items={messageStrings(t, "guarantees.items").map((item) => ({
                  title: item,
                }))}
              />
            </div>
          }
        />
      </Background>

      <PriceTable
        headers={{
          offer: t("table.offer"),
          includes: t("table.includes"),
          duration: t("table.duration"),
          price: t("table.price"),
        }}
        vatNote={offersT("vatNote")}
        groups={GROUPS.map((group) => ({
          title: t(`table.groups.${group.key}`),
          rows: group.offers.map((id) => getOfferCopy(offersT, locale, id)),
        }))}
      />

      <Statement
        className="pt-0 lg:pt-0"
        rows={[{ title: t("market.title"), paragraphs: [t("market.body")] }]}
      />

      <Background variant="bottom">
        <Faq
          title={t("faq.title")}
          items={messageList(t, "faq.items", ["question", "answer"])}
          bookLabel={t("cta.ctaSecondary")}
        />
        <Cta
          title={t("cta.title")}
          body={t("cta.body")}
          primary={{ action: "quote", label: t("cta.ctaPrimary") }}
          secondary={{ action: "book", label: t("cta.ctaSecondary") }}
        />
      </Background>
    </>
  );
}
