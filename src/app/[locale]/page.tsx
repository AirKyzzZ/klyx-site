import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { CaseBand } from "@/components/sections/case-grid";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Founder } from "@/components/sections/founder";
import { HomeHero } from "@/components/sections/hero";
import { OfferCards } from "@/components/sections/offer-cards";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { hasProofStrip, ProofStrip } from "@/components/sections/proof-strip";
import { Testimonials } from "@/components/sections/testimonials";
import { ToolsSection } from "@/components/sections/tools-section";
import { SpotlightPointer } from "@/components/spotlight-pointer";
import { messageList } from "@/i18n/message-list";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getCaseStudies } from "@/lib/content";
import {
  ALSO_OFFERS,
  HOME_OFFER_CARDS,
  selectHomeCases,
} from "@/lib/home-sections";
import { organizationJsonLd } from "@/lib/json-ld";
import {
  formatPrice,
  getOfferPrice,
  getPriceValues,
  type OfferId,
} from "@/lib/offers";
import { getSiteShot, getVerifiedProof } from "@/lib/proof";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { teamRoster } from "@/lib/team-roster";
import { CONNECTED_TOOLS } from "@/lib/tools";

type SectionId =
  | "proof"
  | "offers"
  | "tools"
  | "cases"
  | "process"
  | "founder"
  | "testimonials"
  | "faq";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return buildMetadata({
    locale,
    pathname: "/",
    title: t("title"),
    description: t("description"),
  });
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "home" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const casesT = await getTranslations({ locale, namespace: "cases" });
  const tabs = await getTranslations({ locale, namespace: "liveSystem.tabs" });
  const meta = await getTranslations({ locale, namespace: "meta.home" });
  const cases = selectHomeCases(await getCaseStudies(locale));
  const proof = getVerifiedProof();
  const prices = getPriceValues(locale);
  const price = (id: OfferId) => formatPrice(getOfferPrice(id), locale);

  const candidates: (SectionId | false)[] = [
    hasProofStrip(proof) && "proof",
    "offers",
    "tools",
    cases.length > 0 && "cases",
    "process",
    "founder",
    site.flags.testimonialsConsented && "testimonials",
    "faq",
  ];
  const order = candidates.filter((id): id is SectionId => id !== false);
  const section = (id: SectionId) => ({
    index: String(order.indexOf(id) + 1).padStart(2, "0"),
    eyebrow: t(`eyebrows.${id}`),
  });

  const citeme = getSiteShot("citeme");

  return (
    <>
      <JsonLd data={organizationJsonLd(meta("description"))} />
      <SpotlightPointer />
      <HomeHero locale={locale} />

      <ProofStrip
        {...section("proof")}
        sources={proof}
        locale={locale}
        title={t("proofStrip.title")}
        emphasis={t("proofStrip.titleEmphasis")}
      />

      <OfferCards
        {...section("offers")}
        title={t("offers.title")}
        emphasis={t("offers.titleEmphasis")}
        subtitle={t("offers.subtitle")}
        items={HOME_OFFER_CARDS.map(({ key, href, offer }) => ({
          href,
          glyph: key,
          tag: tabs(key),
          name: t(`offers.cards.${key}.name`),
          outcome: t(`offers.cards.${key}.outcome`),
          price: t(`offers.cards.${key}.price`, { price: price(offer) }),
          duration: t(`offers.cards.${key}.duration`),
          steps: [
            t(`offers.steps.${key}.a`),
            t(`offers.steps.${key}.b`),
            t(`offers.steps.${key}.c`),
          ],
        }))}
        also={{
          label: t("offers.also.label"),
          items: ALSO_OFFERS.map(({ key, href }) => ({
            label: t(`offers.also.${key}`),
            href,
          })),
        }}
      />

      <ToolsSection
        {...section("tools")}
        title={t("tools.title")}
        emphasis={t("tools.titleEmphasis")}
        body={t("tools.body")}
        label={t("tools.label")}
        rows={CONNECTED_TOOLS.map((group) => ({
          ...group,
          label: t(`tools.groups.${group.key}`),
        }))}
        note={t("tools.note")}
      />

      {cases.length > 0 && (
        <CaseBand
          {...section("cases")}
          title={casesT("hero.title")}
          emphasis={casesT("hero.titleEmphasis")}
          subtitle={t("cases.subtitle")}
          viewAllLabel={t("cases.viewAll")}
          readLabel={t("cases.readCase")}
          items={cases}
        />
      )}

      <ProcessTimeline {...section("process")} locale={locale} />

      <Founder
        {...section("founder")}
        title={t("founder.title")}
        emphasis={t("founder.titleEmphasis")}
        body={t("founder.body")}
        experience={t("founder.experience")}
        caption={t("founder.caption")}
        roster={teamRoster(t, "founder.roster")}
        products={{
          label: t("founder.products"),
          items: citeme ? [{ name: "CiteMe", url: citeme.url }] : [],
        }}
        shot={citeme}
        links={[
          { label: t("founder.github"), href: site.socials.github },
          { label: t("founder.linkedin"), href: site.socials.linkedinFounder },
        ]}
        aboutLabel={t("founder.about")}
      />

      <Testimonials
        {...section("testimonials")}
        title={t("testimonials.title")}
        emphasis={t("testimonials.titleEmphasis")}
        items={messageList(t, "testimonials.items", [
          "quote",
          "author",
          "company",
        ])}
      />

      <Faq
        {...section("faq")}
        title={t("faq.title")}
        emphasis={t("faq.titleEmphasis")}
        items={messageList(t, "faq.items", ["question", "answer"], prices)}
        bookLabel={nav("book")}
        openFirst
      />

      <Cta
        title={t("finalCta.title")}
        emphasis={t("finalCta.titleEmphasis")}
        body={t("finalCta.body")}
        primary={{ action: "book", label: t("finalCta.ctaPrimary") }}
        secondary={{ action: "quote", label: t("finalCta.ctaSecondary") }}
        shot={cases[0] ? getSiteShot(cases[0].slug) : null}
      />
    </>
  );
}
