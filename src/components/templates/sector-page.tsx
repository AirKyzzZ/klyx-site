import type { Metadata } from "next";

import {
  ArrowRight,
  ChevronRight,
  Database,
  FileLock,
  FileText,
  FolderGit2,
  Handshake,
  type LucideIcon,
  Receipt,
  Server,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/sections/faq";
import { Button } from "@/components/ui/button";
import { CaseRow } from "@/components/ui-kit/case-row";
import { ComparisonList } from "@/components/ui-kit/comparison-list";
import { FactCard } from "@/components/ui-kit/fact-card";
import { FlowRow } from "@/components/ui-kit/flow-row";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { SiteCta } from "@/components/ui-kit/site-cta";
import { SplitHero } from "@/components/ui-kit/split-hero";
import { TrustGrid } from "@/components/ui-kit/trust-grid";
import { UseCaseCard } from "@/components/ui-kit/use-case-card";
import { messageKeys, messageList, type Translate } from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCaseStudies } from "@/lib/content";
import { trailPageJsonLd } from "@/lib/json-ld";
import { getOfferCopy } from "@/lib/offer-copy";
import { formatPrice, getOfferPrice, getPriceValues } from "@/lib/offers";
import type { SectorPageConfig } from "@/lib/sector-pages";
import { buildMetadata } from "@/lib/seo";

import { fourSteps, MethodSection } from "./method-section";
import { PriceCards } from "./price-cards";

const DATA_ICONS: Record<string, LucideIcon> = {
  data: Database,
  hosting: Server,
  rgpd: ShieldCheck,
};

const TERM_ICONS: Record<string, LucideIcon> = {
  nda: FileLock,
  brand: Tag,
  client: Handshake,
  repo: FolderGit2,
  handover: FileText,
  pricing: Receipt,
};

const textLink =
  "text-text hover:text-accent inline-flex items-center gap-1.5 font-medium underline decoration-1 underline-offset-[3px] transition-colors duration-(--d-fast)";

export async function buildSectorMetadata(
  config: SectorPageConfig,
  locale: Locale,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `meta.${config.key}` });
  return buildMetadata({
    locale,
    pathname: config.pathname,
    title: t("title"),
    description: t("description", getPriceValues(locale)),
  });
}

export async function SectorPage({
  config,
  locale,
}: {
  config: SectorPageConfig;
  locale: Locale;
}) {
  const t = (await getTranslations({
    locale,
    namespace: config.namespace,
  })) as Translate;
  const labels = await getTranslations({
    locale,
    namespace: "useCases.labels",
  });
  const methodT = (await getTranslations({
    locale,
    namespace: config.ownMethod
      ? `${config.namespace}.method`
      : "useCases.method",
  })) as Translate;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const offersT = (await getTranslations({
    locale,
    namespace: "offers",
  })) as Translate;
  const prices = getPriceValues(locale);
  const faq = messageList(t, "faq.items", ["question", "answer"], prices);
  const anchor = getOfferCopy(offersT, locale, config.anchor);
  const { proof } = config;
  const cases =
    proof.kind === "cases"
      ? (await getCaseStudies(locale))
          .filter((study) => proof.slugs.includes(study.slug))
          .sort(
            (a, b) => proof.slugs.indexOf(a.slug) - proof.slugs.indexOf(b.slug),
          )
      : [];

  return (
    <>
      <JsonLd
        data={trailPageJsonLd({
          locale,
          trail: [
            { name: nav("useCases"), pathname: "/cas-usage" },
            { name: nav(config.key), pathname: config.pathname },
          ],
          offerIds: config.offers,
          faq,
        })}
      />

      <SplitHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle", prices)}
        breadcrumb={
          <nav aria-label={labels("breadcrumb")}>
            <ol className="text-text-3 flex flex-wrap items-center gap-1.5 text-sm">
              <li>
                <Link
                  href="/cas-usage"
                  className="hover:text-text transition-colors duration-(--d-fast)"
                >
                  {nav("useCases")}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="text-text-2">
                {nav(config.key)}
              </li>
            </ol>
          </nav>
        }
        actions={
          <>
            <ActionButton action="book" size="xl" trackLocation="hero">
              {labels("book")}
            </ActionButton>
            <ActionButton
              action="quote"
              variant="outline"
              size="xl"
              trackLocation="hero"
            >
              {labels("quote")}
            </ActionButton>
          </>
        }
        aside={
          <FactCard
            visual={
              <div aria-hidden="true">
                <FlowRow
                  from={config.flow.from}
                  to={config.flow.to}
                  agentLabel={labels("agentPill")}
                />
              </div>
            }
            facts={[
              { label: labels("audience"), value: t("hero.audience") },
              { label: labels("offer"), value: t("hero.offer") },
            ]}
            price={{
              label: labels("from"),
              value: formatPrice(getOfferPrice(config.anchor), locale),
              note: `${anchor.name}, ${anchor.duration}`,
            }}
          />
        }
      />

      <PageSection id="probleme">
        <SectionHeader
          title={t("problems.title")}
          intro={t("problems.intro")}
        />
        <ComparisonList
          className="mt-12"
          items={messageKeys(t.raw("problems.items")).map((key) => ({
            title: t(`problems.items.${key}.title`),
            before: {
              label: labels("before"),
              text: t(`problems.items.${key}.before`),
            },
            after: {
              label: labels("after"),
              text: t(`problems.items.${key}.after`),
            },
          }))}
        />
      </PageSection>

      <PageSection id="exemples">
        <SectionHeader
          title={t("workflows.title")}
          intro={t("workflows.intro")}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {config.workflows.map(({ id, from, to, builtByUs }) => (
            <UseCaseCard
              key={id}
              category={t(`workflows.items.${id}.category`)}
              title={t(`workflows.items.${id}.title`)}
              from={from}
              to={to}
              agentLabel={builtByUs ? labels("builder") : labels("agentPill")}
              before={{
                label: builtByUs ? labels("builder") : labels("agent"),
                text: t(`workflows.items.${id}.agent`),
              }}
              after={{
                label: labels("team"),
                text: t(`workflows.items.${id}.team`),
              }}
            />
          ))}
        </div>
        {proof.kind === "none" && (
          <p className="text-text-2 mt-8 flex max-w-[78ch] flex-wrap items-baseline gap-x-3 gap-y-2 text-[0.9375rem] leading-normal">
            {t("workflows.note")}
            <Link href={proof.href} className={textLink}>
              {t("workflows.noteLink")}
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </p>
        )}
      </PageSection>

      {config.terms && (
        <PageSection id="marque-blanche">
          <SectionHeader title={t("terms.title")} intro={t("terms.intro")} />
          <TrustGrid
            className="mt-12"
            items={messageKeys(t.raw("terms.items")).map((key) => ({
              icon: TERM_ICONS[key] ?? FileText,
              title: t(`terms.items.${key}.title`),
              body: t(`terms.items.${key}.body`),
            }))}
          />
        </PageSection>
      )}

      {cases.length > 0 && (
        <PageSection id="realisations">
          <SectionHeader title={t("proof.title")} intro={t("proof.intro")} />
          <div className="mt-10 flex flex-col">
            {cases.map((study) => (
              <CaseRow
                key={study.slug}
                slug={study.slug}
                name={study.title}
                kind={study.client}
                summary={study.summary}
                meta={[...study.stack.slice(0, 2), study.year].join(", ")}
                image={study.image}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              asChild
              className="h-11 rounded-[10px] px-5"
            >
              <Link href="/realisations">{labels("allCases")}</Link>
            </Button>
          </div>
        </PageSection>
      )}

      <PageSection id="tarifs">
        <SectionHeader
          title={t("pricing.title")}
          intro={t("pricing.intro", prices)}
        />
        <PriceCards
          className="mt-12"
          locale={locale}
          labels={{
            from: labels("from"),
            perDay: labels("perDay"),
            viewOffer: labels("viewOffer"),
          }}
          cards={config.offers.map((id) => ({
            id,
            audience: t(`pricing.cards.${id}.audience`),
            body: t(`pricing.cards.${id}.body`),
          }))}
        />
        <div className="mt-8 flex flex-col gap-x-8 gap-y-3 text-[0.9375rem] md:flex-row md:items-baseline md:justify-between">
          <p className="text-text-2 max-w-[70ch] leading-normal">
            {t("pricing.note", prices)}{" "}
            {config.pricingNoteHref && (
              <Link href={config.pricingNoteHref} className={textLink}>
                {t("pricing.noteLink")}
              </Link>
            )}
          </p>
          <Link href="/tarifs" className={`${textLink} shrink-0`}>
            {labels("allPricing")}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </PageSection>

      <MethodSection
        locale={locale}
        title={methodT("title")}
        intro={methodT("intro")}
        steps={fourSteps(
          messageList(methodT, "steps", ["when", "title", "body"]),
        )}
        quote={{
          title: t("method.quote.title"),
          items: ["a", "b", "c"].map((id) => t(`method.quote.items.${id}`)),
          excluded: t("method.quote.excluded"),
          offer: config.quoteOffer,
        }}
        updates={[
          t("method.update.a"),
          t("method.update.b"),
          t("method.update.c"),
        ]}
      />

      <PageSection id="donnees">
        <SectionHeader title={t("data.title")} intro={t("data.intro")} />
        <TrustGrid
          className="mt-12"
          items={messageKeys(t.raw("data.items")).map((key) => ({
            icon: DATA_ICONS[key] ?? Database,
            title: t(`data.items.${key}.title`),
            body: t(`data.items.${key}.body`),
          }))}
          footer={{ label: labels("tools"), models: config.tools }}
        />
      </PageSection>

      <Faq
        id="faq"
        title={t("faq.title")}
        items={faq}
        bookLabel={labels("book")}
        openFirst
      />

      <SiteCta title={t("cta.title")} body={t("cta.body")} />
    </>
  );
}
