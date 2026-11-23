import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { JsonLd } from "@/components/json-ld";
import { FaqList } from "@/components/ui-kit/faq-list";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { SiteCta } from "@/components/ui-kit/site-cta";
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

      <PageSection
        id="hero"
        divider={false}
        containerClassName="pt-32 md:pt-40 lg:pt-44"
      >
        <SectionHeader
          as="h1"
          title={t("hero.title")}
          intro={t("hero.subtitle", prices)}
        >
          <div className="flex flex-wrap gap-3">
            <ActionButton action="book" size="xl" trackLocation="hero">
              {t("hero.ctaPrimary")}
            </ActionButton>
            <ActionButton
              action="quote"
              variant="outline"
              size="xl"
              trackLocation="hero"
            >
              {t("hero.ctaSecondary")}
            </ActionButton>
          </div>
        </SectionHeader>
        <nav aria-label={t("themesLabel")} className="mt-12 lg:mt-16">
          <ul className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <li key={theme.key}>
                <a
                  href={`#${theme.key}`}
                  className="border-line bg-surface-1 text-text-2 hover:border-line-strong hover:text-text inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-(--d-fast)"
                >
                  {t(`themes.${theme.key}`)}
                  <span className="text-text-3 font-normal">
                    {theme.items.length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageSection>

      {themes.map((theme) => (
        <PageSection
          key={theme.key}
          id={theme.key}
          containerClassName="lg:py-24"
        >
          <FaqList
            title={t(`themes.${theme.key}`)}
            items={theme.items.map((item) => ({
              id: item.id,
              question: item.question,
              answer: item.answer,
              more: item.source && (
                <Link
                  href={item.source.pathname}
                  className="group text-text-3 hover:text-accent inline-flex items-center gap-1.5 text-sm transition-colors duration-(--d-fast)"
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
        </PageSection>
      ))}

      <SiteCta
        title={t("cta.title")}
        body={t("cta.body")}
        secondaryLabel={t("cta.secondary")}
      />
    </>
  );
}
