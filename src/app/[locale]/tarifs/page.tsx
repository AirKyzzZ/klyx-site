import type { Metadata } from "next";

import {
  ArrowUpRight,
  BookOpen,
  FileText,
  KeyRound,
  Lock,
  Receipt,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { JsonLd } from "@/components/json-ld";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { OfferPageHero } from "@/components/sections/offer-page-hero";
import { PriceLedger } from "@/components/sections/price-ledger";
import { MethodSteps } from "@/components/ui-kit/method-steps";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { TrustGrid } from "@/components/ui-kit/trust-grid";
import { messageList, type Translate } from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getPosts } from "@/lib/content";
import { pricingPageJsonLd } from "@/lib/json-ld";
import { getPriceValues } from "@/lib/offers";
import { PRICING_POST_SLUG } from "@/lib/related-content";
import { buildMetadata } from "@/lib/seo";

const INCLUDED = {
  quote: FileText,
  fixed: Lock,
  owned: KeyRound,
  handover: BookOpen,
  credit: Receipt,
  tools: Wrench,
} as const;

const LINK_CLASS =
  "text-text hover:text-accent-text font-medium underline decoration-1 underline-offset-[3px] transition-colors duration-(--d-fast)";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.pricing" });
  return buildMetadata({
    locale,
    pathname: "/tarifs",
    title: t("title"),
    description: t("description", getPriceValues(locale)),
  });
}

export default async function PricingPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = (await getTranslations({
    locale,
    namespace: "pricing",
  })) as Translate;
  const page = await getTranslations({ locale, namespace: "offerPage" });
  const offersT = await getTranslations({ locale, namespace: "offers" });
  const guide = (await getPosts(locale)).find(
    (post) => post.slug === PRICING_POST_SLUG,
  );

  return (
    <>
      <JsonLd data={pricingPageJsonLd(locale)} />

      <OfferPageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        actions={
          <>
            <ActionButton action="quote" size="xl" trackLocation="hero">
              {page("actions.quote")}
            </ActionButton>
            <ActionButton
              action="book"
              variant="outline"
              size="xl"
              trackLocation="hero"
            >
              {page("actions.book")}
            </ActionButton>
          </>
        }
      >
        <PriceLedger locale={locale} className="mt-12 lg:mt-16" />
        <p className="text-text-3 mt-4 text-sm">{offersT("vatNote")}</p>
        <div className="text-text-2 mt-8 grid gap-4 text-[0.9375rem] leading-normal lg:grid-cols-2 lg:gap-16">
          <p>
            {t("market.line", getPriceValues(locale))}{" "}
            <a
              href={t("market.url")}
              target="_blank"
              rel="noopener"
              className={`${LINK_CLASS} inline-flex items-center gap-1`}
            >
              {t("market.sourceLabel")}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          </p>
          {guide && (
            <p>
              {t("guide")}{" "}
              <Link
                href={{
                  pathname: "/blog/[slug]",
                  params: { slug: guide.slug },
                }}
                className={LINK_CLASS}
              >
                {guide.title}
              </Link>
            </p>
          )}
        </div>
      </OfferPageHero>

      <PageSection id="compris">
        <SectionHeader
          title={t("included.title")}
          intro={t("included.intro")}
        />
        <TrustGrid
          className="mt-12"
          items={Object.entries(INCLUDED).map(([key, icon]) => ({
            icon,
            title: t(`included.items.${key}.title`),
            body: t(`included.items.${key}.body`),
          }))}
        />
      </PageSection>

      <PageSection id="devis">
        <SectionHeader title={t("quote.title")} intro={t("quote.intro")} />
        <MethodSteps
          className="mt-12"
          steps={messageList(t, "quote.steps", ["title", "body"])}
        />
      </PageSection>

      <Faq
        id="faq"
        title={t("faq.title")}
        items={messageList(t, "faq.items", ["question", "answer"])}
        bookLabel={page("actions.book")}
        openFirst
      />

      <Cta
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ action: "quote", label: t("cta.ctaPrimary") }}
        secondary={{ action: "book", label: t("cta.ctaSecondary") }}
      />
    </>
  );
}
