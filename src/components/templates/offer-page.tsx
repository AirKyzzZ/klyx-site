import type { JSX } from "react";

import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { JsonLd } from "@/components/json-ld";
import { AuditDocument } from "@/components/offer-blocks/audit-document";
import { AutomationExamples } from "@/components/offer-blocks/automation-examples";
import { FdeDefinition } from "@/components/offer-blocks/fde-definition";
import { GeoVisibility } from "@/components/offer-blocks/geo-visibility";
import { LighthouseBlock } from "@/components/offer-blocks/lighthouse-block";
import { TraceSpans } from "@/components/offer-blocks/trace-spans";
import { Section, SectionHeading } from "@/components/section";
import { CaseCard } from "@/components/sections/case-grid";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { OfferHero } from "@/components/sections/offer-hero";
import { OfferLedger } from "@/components/sections/offer-ledger";
import { ProcessLine } from "@/components/sections/process-line";
import { FeatureList, TierCards } from "@/components/sections/tier-cards";
import { ToolsSection } from "@/components/sections/tools-section";
import { WorkLog } from "@/components/sections/work-log";
import {
  messageList,
  messageStrings,
  type Translate,
} from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCaseStudies, getPosts } from "@/lib/content";
import { offerPageJsonLd } from "@/lib/json-ld";
import { getOfferCopy } from "@/lib/offer-copy";
import type {
  OfferAction,
  OfferBlock,
  OfferPageConfig,
} from "@/lib/offer-pages";
import { getPriceValues } from "@/lib/offers";
import { OFFER_POST_SLUGS } from "@/lib/related-content";
import { sectorPages } from "@/lib/sector-pages";
import { buildMetadata } from "@/lib/seo";
import { DEPLOYED_TECH } from "@/lib/tools";
import { cn } from "@/lib/utils";

type BlockProps = { locale: Locale; index: string; eyebrow: string };

const BLOCKS: Record<
  OfferBlock,
  (props: BlockProps) => Promise<JSX.Element | null>
> = {
  trace: TraceSpans,
  lighthouse: LighthouseBlock,
  "fde-definition": FdeDefinition,
  "audit-document": AuditDocument,
  "automation-examples": AutomationExamples,
  "geo-visibility": GeoVisibility,
};

type SectionId =
  | "problem"
  | "deliverables"
  | "process"
  | "block"
  | "worklog"
  | "stack"
  | "proof"
  | "pricing"
  | "faq";

const SECTIONS: SectionId[] = [
  "problem",
  "deliverables",
  "process",
  "block",
  "worklog",
  "stack",
  "proof",
  "pricing",
  "faq",
];

function hasChild(t: Translate, key: string, child: string) {
  const raw = t.raw(key);
  return typeof raw === "object" && raw !== null && child in raw;
}

function heading(t: Translate, key: string) {
  return {
    lead: t(`${key}.title`),
    rest: hasChild(t, key, "titleEmphasis")
      ? t(`${key}.titleEmphasis`)
      : undefined,
  };
}

function actionLabel(
  t: Translate,
  cta: [OfferAction, OfferAction],
  action: OfferAction,
) {
  return t(cta[0] === action ? "cta.ctaPrimary" : "cta.ctaSecondary");
}

export async function buildOfferMetadata(
  config: OfferPageConfig,
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

export async function OfferPage({
  config,
  locale,
}: {
  config: OfferPageConfig;
  locale: Locale;
}): Promise<JSX.Element> {
  const t = (await getTranslations({
    locale,
    namespace: config.namespace,
  })) as Translate;
  const page = await getTranslations({ locale, namespace: "offerPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const offersT = (await getTranslations({
    locale,
    namespace: "offers",
  })) as Translate;
  const casesT = await getTranslations({ locale, namespace: "cases.labels" });
  const relatedPost = (await getPosts(locale)).find(
    (post) => post.slug === OFFER_POST_SLUGS[config.key],
  );
  const prices = getPriceValues(locale);
  const faq = messageList(t, "faq.items", ["question", "answer"], prices);
  const tiers = config.tiers.map((id) => getOfferCopy(offersT, locale, id));
  const cases = (await getCaseStudies(locale)).filter((study) =>
    config.proofSlugs.includes(study.slug),
  );
  const anchorPrice = config.anchorLine
    ? t("hero.anchor", prices)
    : getOfferCopy(offersT, locale, config.anchor).price;
  const Block = BLOCKS[config.block];
  const hero = heading(t, "hero");
  const problem = heading(t, "problem");
  const deliverables = heading(t, "deliverables");
  const process = heading(t, "process");
  const pricing = heading(t, "pricing");
  const faqHeading = heading(t, "faq");
  const cta = heading(t, "cta");
  const isFde = config.key === "fde";
  const proofCases = cases.slice(0, 2);
  const singleProof = proofCases.length === 1;

  const hasProof = config.proofLink !== null;
  const hidden = new Set<SectionId>([
    ...(hasProof ? [] : (["proof"] as const)),
    ...(config.stack ? [] : (["stack"] as const)),
    ...(config.process ? [] : (["process"] as const)),
    ...(config.pricing ? [] : (["pricing"] as const)),
    ...(isFde ? [] : (["worklog"] as const)),
  ]);
  const sections = SECTIONS.filter((id) => !hidden.has(id));
  const pricingLinks = (
    <>
      <Link
        href="/tarifs"
        className="group text-text-2 hover:text-text mt-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        {t("pricing.link")}
        <ArrowRight
          aria-hidden="true"
          className="size-3.5 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
        />
      </Link>
      {config.sectors.length > 0 && (
        <p className="text-text-3 mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          <span className="type-label pt-0.5">{page("sectors")}</span>
          {config.sectors.map((key) => (
            <Link
              key={key}
              href={sectorPages[key].pathname}
              className="text-text hover:text-text-2 underline underline-offset-4 transition-colors"
            >
              {nav(key)}
            </Link>
          ))}
        </p>
      )}
    </>
  );
  const section = (id: SectionId) => ({
    index: String(sections.indexOf(id) + 1).padStart(2, "0"),
    eyebrow:
      id === "block"
        ? page(`eyebrows.block.${config.block}`)
        : page(`eyebrows.${id}`),
  });

  return (
    <>
      <JsonLd
        data={offerPageJsonLd({
          locale,
          pathname: config.pathname,
          navKey: config.key,
          offerIds: config.tiers,
          faq,
        })}
      />

      <OfferHero
        locale={locale}
        breadcrumbLabel={page("breadcrumb")}
        trail={[{ href: "/tarifs", label: nav("offers") }]}
        current={t("hero.eyebrow")}
        anchorPrice={anchorPrice}
        title={hero.lead}
        emphasis={hero.rest}
        serif={t("hero.serif")}
        subtitle={t("hero.subtitle", prices)}
        primaryLabel={t("hero.ctaPrimary")}
        secondaryLabel={t("hero.ctaSecondary")}
        scenario={config.scenario}
      />

      <Section {...section("problem")}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="reveal lg:col-span-8">
            <SectionHeading
              lead={problem.lead}
              rest={problem.rest}
              className="max-w-[28ch]"
            />
            <p className="text-text-2 mt-8 max-w-[62ch]">{t("problem.body")}</p>
          </div>
          <aside className="reveal border-line self-end border-t pt-5 lg:col-span-3 lg:col-start-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <p className="type-label text-text-3">{page("symptoms")}</p>
            <ul className="mt-4 space-y-3 text-[0.9375rem] leading-snug">
              {messageStrings(t, "problem.symptoms").map((symptom, i) => (
                <li key={symptom} className="text-text-2 flex gap-3">
                  <span className="type-data text-text-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {symptom}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      <TierCards
        {...section("deliverables")}
        title={deliverables.lead}
        emphasis={deliverables.rest}
        subtitle={
          hasChild(t, "deliverables", "subtitle")
            ? t("deliverables.subtitle")
            : undefined
        }
        quoteLabel={t("hero.ctaSecondary")}
        seeOfferLabel={page("seeOffer")}
        moreLabel={(count) => page("moreFeatures", { count })}
        footnote={offersT("vatNote")}
        aside={config.pricing ? undefined : pricingLinks}
        tiers={
          isFde
            ? []
            : tiers.map((tier) => ({
                id: tier.id,
                name: tier.name,
                price: tier.price,
                duration: tier.duration,
                summary: tier.summary,
                features: messageStrings(
                  t,
                  `deliverables.tiers.${tier.key}.items`,
                ),
                href: tier.href === config.pathname ? undefined : tier.href,
              }))
        }
      >
        {isFde ? (
          <FdeTermsCard
            t={t}
            prices={prices}
            tier={tiers[0]}
            quoteLabel={t("hero.ctaSecondary")}
          />
        ) : null}
      </TierCards>

      {config.process && (
        <ProcessLine
          {...section("process")}
          title={process.lead}
          emphasis={process.rest}
          steps={messageList(t, "process.steps", ["title", "body"])}
        />
      )}

      <Block locale={locale} {...section("block")} />

      {isFde && <WorkLog locale={locale} {...section("worklog")} />}

      {config.stack && (
        <ToolsSection
          {...section("stack")}
          title={page("stack.title")}
          emphasis={t("stack.titleEmphasis")}
          body={page("stack.body")}
          label={page("stack.label")}
          rows={DEPLOYED_TECH.map((group) => ({
            ...group,
            label: page(`stack.groups.${group.key}`),
          }))}
          note={page("stack.note")}
          layout="strip"
        />
      )}

      {hasProof && (
        <Section {...section("proof")}>
          <div className="reveal tone-sand relative grid gap-10 rounded-xl p-6 md:p-10 lg:grid-cols-12 lg:gap-6 lg:p-12">
            <div
              className={cn(
                "grid gap-6",
                singleProof
                  ? "content-start lg:col-span-5"
                  : "lg:col-span-12 lg:grid-cols-12 lg:items-end",
              )}
            >
              <SectionHeading
                lead={heading(t, "proof").lead}
                rest={heading(t, "proof").rest}
                className={singleProof ? undefined : "lg:col-span-7"}
              />
              <div
                className={cn(
                  "space-y-5",
                  !singleProof && "lg:col-span-4 lg:col-start-9",
                )}
              >
                <p className="text-text-2 max-w-[44ch]">{t("proof.body")}</p>
                <Link
                  href="/realisations"
                  className="group border-ink/20 text-text hover:bg-sand-200 inline-flex h-11 items-center gap-2 rounded-sm border px-4.5 text-[0.9375rem] font-medium transition-colors duration-(--d-fast)"
                >
                  {t("proof.link")}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
            {proofCases.length > 0 && (
              <ul
                className={cn(
                  "grid gap-x-6 gap-y-12",
                  singleProof
                    ? "lg:col-span-6 lg:col-start-7"
                    : "md:grid-cols-2 lg:col-span-12",
                )}
              >
                {proofCases.map((study) => (
                  <li key={study.slug}>
                    <CaseCard
                      item={study}
                      readLabel={casesT("read")}
                      sizes="(min-width: 1024px) 540px, 90vw"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>
      )}

      {config.pricing && (
        <Section {...section("pricing")}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="reveal space-y-6 lg:col-span-5">
              <SectionHeading lead={pricing.lead} rest={pricing.rest} />
              <p className="text-text-2 max-w-[48ch]">
                {t("pricing.body", prices)}
              </p>
            </div>
            <div className="reveal lg:col-span-6 lg:col-start-7">
              <OfferLedger
                trackLocation="offer_page"
                rows={tiers}
                labels={{
                  offer: page("ledger.offer"),
                  duration: page("ledger.duration"),
                  price: page("ledger.price"),
                }}
                caption={offersT("vatNote")}
              />
              {pricingLinks}
            </div>
          </div>
        </Section>
      )}

      <Faq
        {...section("faq")}
        title={faqHeading.lead}
        emphasis={faqHeading.rest}
        items={faq}
        bookLabel={actionLabel(t, config.cta, "book")}
        openFirst
      />

      {relatedPost && (
        <section className="relative z-1">
          <div className="container pb-16 md:pb-24">
            <h2 className="type-label text-text-3">{page("relatedPost")}</h2>
            <Link
              href={{
                pathname: "/blog/[slug]",
                params: { slug: relatedPost.slug },
              }}
              className="text-text-2 hover:text-text mt-4 inline-block underline underline-offset-4 transition-colors"
            >
              {relatedPost.title}
            </Link>
          </div>
        </section>
      )}

      <Cta
        title={cta.lead}
        emphasis={cta.rest}
        body={t("cta.body")}
        primary={{ action: config.cta[0], label: t("cta.ctaPrimary") }}
        secondary={{ action: config.cta[1], label: t("cta.ctaSecondary") }}
      />
    </>
  );
}

function FdeTermsCard({
  t,
  prices,
  tier,
  quoteLabel,
}: {
  t: Translate;
  prices: ReturnType<typeof getPriceValues>;
  tier: ReturnType<typeof getOfferCopy>;
  quoteLabel: string;
}) {
  return (
    <div className="reveal beam mt-12 md:mt-16">
      <article className="bg-surface-1 shadow-card grid gap-10 rounded-[calc(var(--r-md)-1px)] p-5 lg:grid-cols-12 lg:gap-6 lg:p-8">
        <div className="lg:col-span-6">
          <p className="type-label text-text-3">
            <span className="text-accent-text">01</span> / {tier.duration}
          </p>
          <h3 className="type-h3 mt-6">{tier.name}</h3>
          <p className="text-text-2 mt-2 max-w-[44ch] text-[0.9375rem]">
            {tier.summary}
          </p>
          <div className="mt-6">
            <FeatureList items={messageStrings(t, "deliverables.items")} />
          </div>
          <div className="mt-8">
            <ActionButton trackLocation="offer_page" action="quote">
              {quoteLabel}
            </ActionButton>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="type-label text-text-3">{t("terms.title")}</p>
          <table className="type-data mt-4 w-full">
            <tbody>
              {messageStrings(t, "terms.items", prices).map((term, i) => (
                <tr key={term} className="border-line border-b last:border-b-0">
                  <td className="text-text-3 w-10 py-3 align-top">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="text-text py-3">{term}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
