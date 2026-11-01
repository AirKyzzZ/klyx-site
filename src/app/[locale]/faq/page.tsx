import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { EmphasisTitle } from "@/components/emphasis-title";
import { JsonLd } from "@/components/json-ld";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import type { Translate } from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { faqThemes } from "@/lib/faq-page";
import { trailPageJsonLd } from "@/lib/json-ld";
import { getPriceValues } from "@/lib/offers";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.faq" });
  return buildMetadata({
    locale,
    pathname: "/faq",
    title: t("title"),
    description: t("description"),
  });
}

export default async function FaqPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "faqPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const root = (await getTranslations({ locale })) as Translate;
  const prices = getPriceValues(locale);
  const themes = faqThemes(root, prices);
  const items = themes.flatMap((theme) => theme.items);

  return (
    <>
      <JsonLd
        data={trailPageJsonLd({
          locale,
          trail: [{ name: nav("faq"), pathname: "/faq" }],
          faq: items,
        })}
      />

      <section
        data-shot="hero"
        className="relative pt-28 pb-12 md:pt-36 md:pb-16"
      >
        <div className="container grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div className="lg:col-span-7">
            <p className="hero-in type-label text-accent">
              {t("count", { count: items.length, themes: themes.length })}
            </p>
            <h1 className="type-h1 mt-4 max-w-[20ch]">
              <EmphasisTitle
                title={t("hero.title")}
                emphasis={t("hero.titleEmphasis")}
                serif={t("hero.serif")}
              />
            </h1>
            <p className="hero-in type-lead text-text-2 mt-5 max-w-[58ch]">
              {t("hero.subtitle", prices)}
            </p>
            <div className="hero-in mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ActionButton
                action="book"
                size="lg"
                className="w-full sm:w-auto"
              >
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
          <nav
            aria-label={t("themesLabel")}
            className="hero-in lg:col-span-4 lg:col-start-9"
          >
            <p className="type-label text-text-3">{t("themesLabel")}</p>
            <ol className="border-line mt-4 border-t">
              {themes.map((theme, i) => (
                <li key={theme.key} className="border-line border-b">
                  <a
                    href={`#${theme.key}`}
                    className="group hover:text-text text-text-2 flex items-baseline justify-between gap-4 py-2.5 text-[0.9375rem] transition-colors"
                  >
                    <span>
                      <span className="type-data text-text-3 mr-3">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {t(`themes.${theme.key}`)}
                    </span>
                    <span className="type-data text-text-3">
                      {theme.items.length}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {themes.map((theme, i) => (
        <Faq
          key={theme.key}
          id={theme.key}
          index={String(i + 1).padStart(2, "0")}
          eyebrow={t(`themes.${theme.key}`)}
          title={t(`themes.${theme.key}`)}
          openAll
          items={theme.items.map((item) => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
            more: item.source && (
              <Link
                href={item.source.pathname}
                className="group text-text-3 hover:text-text inline-flex items-center gap-1.5 text-sm transition-colors"
              >
                {t("source", { page: nav(item.source.navKey) })}
                <ArrowRight
                  aria-hidden="true"
                  className="size-3.5 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
                />
              </Link>
            ),
          }))}
        />
      ))}

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
