import type { CSSProperties, JSX } from "react";

import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { EmphasisTitle } from "@/components/emphasis-title";
import { JsonLd } from "@/components/json-ld";
import { LiveSystem } from "@/components/live-system/live-system";
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
import { ProcessLine } from "@/components/sections/process-line";
import { FeatureList, TierCards } from "@/components/sections/tier-cards";
import { ToolsSection } from "@/components/sections/tools-section";
import {
  messageList,
  messageStrings,
  type Translate,
} from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCaseStudies } from "@/lib/content";
import { offerPageJsonLd } from "@/lib/json-ld";
import { getOfferCopy } from "@/lib/offer-copy";
import type {
  OfferAction,
  OfferBlock,
  OfferPageConfig,
} from "@/lib/offer-pages";
import { getPriceValues } from "@/lib/offers";
import { getSiteShot } from "@/lib/proof";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
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
  | "stack"
  | "proof"
  | "pricing"
  | "faq";

const SECTIONS: SectionId[] = [
  "problem",
  "deliverables",
  "process",
  "block",
  "stack",
  "proof",
  "pricing",
  "faq",
];

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

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
  const prices = getPriceValues(locale);
  const faq = messageList(t, "faq.items", ["question", "answer"], prices);
  const tiers = config.tiers.map((id) => getOfferCopy(offersT, locale, id));
  const cases = (await getCaseStudies(locale)).filter((study) =>
    config.proofSlugs.includes(study.slug),
  );
  const anchorPrice = getOfferCopy(offersT, locale, config.anchor).price;
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
  const sections = SECTIONS.filter(
    (id) => (hasProof || id !== "proof") && (config.stack || id !== "stack"),
  );
  const section = (id: SectionId) => ({
    index: String(sections.indexOf(id) + 1).padStart(2, "0"),
    eyebrow:
      id === "block"
        ? page(`eyebrows.block.${config.block}`)
        : page(`eyebrows.${id}`),
  });

  const firstShot = cases
    .map((study) => getSiteShot(study.slug))
    .find((shot) => shot !== null);

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

      <section className="relative pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container grid gap-12 xl:grid-cols-12 xl:items-center xl:gap-6">
          <div className="xl:col-span-5">
            <nav
              aria-label={page("breadcrumb")}
              className="hero-in"
              style={delay(0)}
            >
              <ol className="type-label text-text-3 flex flex-wrap gap-2">
                <li>
                  <Link
                    href="/tarifs"
                    className="hover:text-text transition-colors"
                  >
                    {nav("offers")}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-text-2">
                  {t("hero.eyebrow")}
                </li>
              </ol>
            </nav>
            <p
              className="hero-in type-label text-accent mt-6"
              style={delay(0.08)}
            >
              {anchorPrice}
            </p>
            <h1 className="type-h1 mt-3 max-w-[20ch]">
              <EmphasisTitle
                title={hero.lead}
                emphasis={hero.rest}
                serif={t("hero.serif")}
              />
            </h1>
            <p
              className="hero-in type-lead text-text-2 mt-5 max-w-[54ch]"
              style={delay(0.15)}
            >
              {t("hero.subtitle", prices)}
            </p>
            <div
              className="hero-in mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={delay(0.3)}
            >
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
          <div className="hero-in xl:col-span-7" style={delay(0.45)}>
            <LiveSystem
              scenarioIds={[config.scenario]}
              initial={config.scenario}
              locale={locale}
            />
          </div>
        </div>
      </section>

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
            <ul className="type-data mt-4 space-y-3">
              {messageStrings(t, "problem.symptoms").map((symptom, i) => (
                <li key={symptom} className="text-text-2 flex gap-3">
                  <span className="text-text-3">
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
                highlighted: tier.id === config.highlighted,
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

      <ProcessLine
        {...section("process")}
        title={process.lead}
        emphasis={process.rest}
        steps={messageList(t, "process.steps", ["title", "body"])}
      />

      <Block locale={locale} {...section("block")} />

      {config.stack && (
        <ToolsSection
          {...section("stack")}
          title={page("stack.title")}
          emphasis={page("stack.titleEmphasis")}
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
                {config.proofLink === "github" ? (
                  <a
                    href={site.socials.github}
                    target="_blank"
                    rel="noopener"
                    className="group border-ink/20 text-text hover:bg-sand-200 inline-flex h-11 items-center gap-2 rounded-sm border px-4.5 text-[0.9375rem] font-medium transition-colors duration-(--d-fast)"
                  >
                    {t("proof.link")}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                ) : (
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
                )}
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

      <Section {...section("pricing")}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="reveal space-y-6 lg:col-span-5">
            <SectionHeading lead={pricing.lead} rest={pricing.rest} />
            <p className="text-text-2 max-w-[48ch]">
              {t("pricing.body", prices)}
            </p>
          </div>
          <div className="reveal lg:col-span-6 lg:col-start-7">
            <table className="w-full text-left">
              <caption className="type-label text-text-3 caption-bottom pt-4 text-left">
                {offersT("vatNote")}
              </caption>
              <thead className="max-sm:sr-only">
                <tr className="border-line type-label text-text-3 border-b">
                  <th scope="col" className="py-3 pr-4 font-normal">
                    {page("ledger.offer")}
                  </th>
                  <th scope="col" className="py-3 pr-4 font-normal">
                    {page("ledger.duration")}
                  </th>
                  <th scope="col" className="py-3 text-right font-normal">
                    {page("ledger.price")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => (
                  <tr
                    key={tier.id}
                    className="border-line hover:bg-surface-1 border-b transition-colors duration-(--d-fast) max-sm:flex max-sm:flex-col max-sm:gap-1 max-sm:py-4"
                  >
                    <th
                      scope="row"
                      className="py-4 pr-4 font-medium max-sm:py-0"
                    >
                      <Link
                        href={tier.href}
                        className="hover:text-text-2 transition-colors"
                      >
                        {tier.name}
                      </Link>
                    </th>
                    <td className="type-data text-text-3 py-4 pr-4 max-sm:py-0">
                      {tier.duration}
                    </td>
                    <td className="type-data text-text py-4 text-right whitespace-nowrap max-sm:py-0 max-sm:text-left">
                      {tier.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          </div>
        </div>
      </Section>

      <Faq
        {...section("faq")}
        title={faqHeading.lead}
        emphasis={faqHeading.rest}
        items={faq}
        bookLabel={actionLabel(t, config.cta, "book")}
        openFirst
      />

      <Cta
        title={cta.lead}
        emphasis={cta.rest}
        body={t("cta.body")}
        primary={{ action: config.cta[0], label: t("cta.ctaPrimary") }}
        secondary={{ action: config.cta[1], label: t("cta.ctaSecondary") }}
        shot={firstShot ?? null}
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
            <span className="text-accent">01</span> / {tier.duration}
          </p>
          <h3 className="type-h3 mt-6">{tier.name}</h3>
          <p className="text-text-2 mt-2 max-w-[44ch] text-[0.9375rem]">
            {tier.summary}
          </p>
          <div className="mt-6">
            <FeatureList items={messageStrings(t, "deliverables.items")} />
          </div>
          <div className="mt-8">
            <ActionButton action="quote">{quoteLabel}</ActionButton>
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
