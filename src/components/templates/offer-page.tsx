import { Fragment, type JSX } from "react";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { JsonLd } from "@/components/json-ld";
import { AgentLog } from "@/components/offer-blocks/agent-log";
import { AuditDocument } from "@/components/offer-blocks/audit-document";
import { AutomationUseCases } from "@/components/offer-blocks/automation-use-cases";
import { FdeDefinition } from "@/components/offer-blocks/fde-definition";
import { GeoVisibility } from "@/components/offer-blocks/geo-visibility";
import { LighthouseBlock } from "@/components/offer-blocks/lighthouse-block";
import { BeforeAfterCards } from "@/components/sections/before-after-cards";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import {
  OfferPageHero,
  OfferPriceCard,
} from "@/components/sections/offer-page-hero";
import { TermsCard, TierCards } from "@/components/sections/tier-cards";
import { CaseRow } from "@/components/ui-kit/case-row";
import { MethodSteps } from "@/components/ui-kit/method-steps";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { ToolsStrip } from "@/components/ui-kit/tools-strip";
import {
  messageKeys,
  messageList,
  messageStrings,
  type Translate,
} from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCaseStudies, getPosts } from "@/lib/content";
import { offerPageJsonLd } from "@/lib/json-ld";
import { getOfferCopy } from "@/lib/offer-copy";
import type { OfferBlock, OfferPageConfig } from "@/lib/offer-pages";
import {
  formatPrice,
  getOffer,
  getPriceValues,
  type OfferId,
} from "@/lib/offers";
import { OFFER_POST_SLUGS } from "@/lib/related-content";
import { sectorPages } from "@/lib/sector-pages";
import { buildMetadata } from "@/lib/seo";
import { DEPLOYED_TECH } from "@/lib/tools";

const BLOCKS: Record<
  OfferBlock,
  (props: { locale: Locale }) => Promise<JSX.Element | null>
> = {
  trace: AgentLog,
  lighthouse: LighthouseBlock,
  "fde-definition": FdeDefinition,
  "audit-document": AuditDocument,
  "automation-examples": AutomationUseCases,
  "geo-visibility": GeoVisibility,
};

const LINK_CLASS =
  "text-text hover:text-accent font-medium underline decoration-1 underline-offset-[3px] transition-colors duration-(--d-fast)";

export function offerPriceParts(
  id: OfferId,
  locale: Locale,
  page: Translate,
  offersT: Translate,
) {
  const offer = getOffer(id);
  if (offer.priceFrom === null) {
    return { price: offersT(`items.${offer.durationKey}.price`) };
  }
  const units = { day: page("perDay"), month: page("perMonth") };
  return {
    priceLabel: page("from"),
    price: formatPrice(offer.priceFrom, locale),
    unit: offer.unit === "project" ? undefined : units[offer.unit],
  };
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
  const page = (await getTranslations({
    locale,
    namespace: "offerPage",
  })) as Translate;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const offersT = (await getTranslations({
    locale,
    namespace: "offers",
  })) as Translate;
  const prices = getPriceValues(locale);
  const faq = messageList(t, "faq.items", ["question", "answer"], prices);
  const relatedPost = (await getPosts(locale)).find(
    (post) => post.slug === OFFER_POST_SLUGS[config.key],
  );
  const studies = await getCaseStudies(locale);
  const cases = config.proofSlugs.flatMap((slug) =>
    studies.filter((study) => study.slug === slug),
  );
  const anchor = offerPriceParts(config.anchor, locale, page, offersT);
  const Block = BLOCKS[config.block];
  const problems = messageKeys(t.raw("problem.items")).map((key) => ({
    title: t(`problem.items.${key}.title`),
    before: t(`problem.items.${key}.before`),
    after: t(`problem.items.${key}.after`),
  }));
  const tiers = config.tiers.map((id) => {
    const copy = getOfferCopy(offersT, locale, id);
    return {
      id,
      name: copy.name,
      audience: t(`deliverables.tiers.${copy.key}.audience`),
      summary: copy.summary,
      duration: copy.duration,
      ...offerPriceParts(id, locale, page, offersT),
      features: messageStrings(t, `deliverables.tiers.${copy.key}.items`),
      href: copy.href === config.pathname ? undefined : copy.href,
    };
  });
  const fde =
    config.key === "fde" ? getOfferCopy(offersT, locale, "fde") : null;

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

      <OfferPageHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle", prices)}
        actions={
          <>
            <ActionButton action="book" size="xl" trackLocation="offer_page">
              {page("actions.book")}
            </ActionButton>
            <ActionButton
              action="quote"
              variant="outline"
              size="xl"
              trackLocation="offer_page"
            >
              {page("actions.quote")}
            </ActionButton>
          </>
        }
        aside={
          <OfferPriceCard
            label={anchor.priceLabel ?? ""}
            price={anchor.price}
            unit={anchor.unit}
            duration={t("hero.duration")}
            note={t("hero.note", prices)}
          />
        }
      />

      <PageSection id="probleme">
        <SectionHeader title={t("problem.title")} intro={t("problem.intro")} />
        <BeforeAfterCards
          className="mt-12"
          items={problems}
          labels={{
            before: page("problem.before"),
            after: page("problem.after"),
          }}
        />
      </PageSection>

      <PageSection id="offre">
        <SectionHeader
          title={t("deliverables.title")}
          intro={t("deliverables.intro")}
        />
        {fde ? (
          <TermsCard
            className="mt-12"
            name={fde.name}
            audience={fde.summary}
            features={messageStrings(t, "deliverables.items")}
            termsTitle={t("terms.title")}
            terms={messageStrings(t, "terms.items", prices)}
            action={
              <ActionButton
                action="quote"
                variant="outline"
                trackLocation="offer_page"
                className="h-10 rounded-[10px] px-4"
              >
                {page("tiers.quote")}
              </ActionButton>
            }
          />
        ) : (
          <TierCards
            className="mt-12"
            tiers={tiers}
            quoteLabel={page("tiers.quote")}
            seeOfferLabel={page("tiers.seeOffer")}
          />
        )}
        <p className="text-text-3 mt-5 text-sm">{offersT("vatNote")}</p>
      </PageSection>

      <PageSection id="methode">
        <SectionHeader title={t("process.title")} intro={t("process.intro")} />
        <MethodSteps
          className="mt-12"
          steps={messageList(t, "process.steps", ["title", "body"])}
        />
      </PageSection>

      <Block locale={locale} />

      {config.stack && (
        <PageSection id="outils" containerClassName="py-11 lg:py-11">
          <ToolsStrip
            title={page("stack.label")}
            tools={DEPLOYED_TECH.flatMap((group) => group.tools)}
          />
          <p className="text-text-3 mx-auto mt-5 max-w-[640px] text-center text-xs leading-normal">
            {page("stack.note")}
          </p>
        </PageSection>
      )}

      {cases.length > 0 && (
        <PageSection id="realisations">
          <SectionHeader title={t("proof.title")} intro={t("proof.intro")}>
            <Link href="/realisations" className={`${LINK_CLASS} w-fit`}>
              {t("proof.link")}
            </Link>
          </SectionHeader>
          <div className="border-line mt-10 flex flex-col border-t">
            {cases.map((study) => (
              <CaseRow
                key={study.slug}
                slug={study.slug}
                name={study.client}
                kind={study.title}
                summary={study.summary}
                meta={[...study.stack.slice(0, 2), study.year].join(", ")}
                image={study.image}
              />
            ))}
          </div>
        </PageSection>
      )}

      <PageSection id="prix">
        <SectionHeader
          title={t("pricing.title")}
          intro={t("pricing.body", prices)}
        >
          <ul className="text-text-3 flex flex-col gap-2.5 text-[0.9375rem]">
            <li>
              <Link href="/tarifs" className={LINK_CLASS}>
                {t("pricing.link")}
              </Link>
            </li>
            {relatedPost && (
              <li>
                {page("relatedPost")}{" "}
                <Link
                  href={{
                    pathname: "/blog/[slug]",
                    params: { slug: relatedPost.slug },
                  }}
                  className={LINK_CLASS}
                >
                  {relatedPost.title}
                </Link>
              </li>
            )}
            {config.sectors.length > 0 && (
              <li>
                {page("sectors")}{" "}
                {config.sectors.map((key, i) => (
                  <Fragment key={key}>
                    {i > 0 && ", "}
                    <Link
                      href={sectorPages[key].pathname}
                      className={LINK_CLASS}
                    >
                      {nav(key)}
                    </Link>
                  </Fragment>
                ))}
              </li>
            )}
          </ul>
        </SectionHeader>
      </PageSection>

      <Faq
        id="faq"
        title={t("faq.title")}
        items={faq}
        bookLabel={page("actions.book")}
        openFirst
      />

      <Cta
        title={t("cta.title")}
        body={t("cta.body")}
        primary={{ action: config.cta[0], label: t("cta.ctaPrimary") }}
        secondary={{ action: config.cta[1], label: t("cta.ctaSecondary") }}
      />
    </>
  );
}
