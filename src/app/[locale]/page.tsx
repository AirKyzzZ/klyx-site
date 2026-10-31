import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { CaseGrid } from "@/components/sections/case-grid";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Founder } from "@/components/sections/founder";
import { Hero } from "@/components/sections/hero";
import { OfferCards } from "@/components/sections/offer-cards";
import { ProcessSteps } from "@/components/sections/process-steps";
import { ProofCard } from "@/components/sections/proof-card";
import { Testimonials } from "@/components/sections/testimonials";
import { messageList } from "@/i18n/message-list";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getCaseStudies } from "@/lib/content";
import { formatPrice, getOfferPrice, getPriceValues } from "@/lib/offers";
import { site } from "@/lib/site";

const HOME_CASE_COUNT = 3;

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return { title: { absolute: t("title") }, description: t("description") };
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "home" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const offersT = await getTranslations({ locale, namespace: "offers" });
  const cases = await getCaseStudies(locale);
  const prices = getPriceValues(locale);
  const price = (id: Parameters<typeof getOfferPrice>[0]) =>
    formatPrice(getOfferPrice(id), locale);

  return (
    <>
      <Background className="via-muted to-muted/80">
        <Hero
          title={t("hero.title")}
          emphasis={t("hero.titleEmphasis")}
          subtitle={t("hero.subtitle")}
          primary={{ action: "book", label: t("hero.ctaPrimary") }}
          secondary={{ action: "quote", label: t("hero.ctaSecondary") }}
          aside={
            <ProofCard
              label={t("proof.label")}
              title={t("proof.title")}
              body={t("proof.body")}
            />
          }
        />
        <OfferCards
          label={offersT("vatNote")}
          title={t("offers.title")}
          subtitle={t("offers.subtitle")}
          linkLabel={t("offers.link")}
          items={[
            {
              href: "/services/creation-site-web",
              name: t("offers.cards.sites.name"),
              outcome: t("offers.cards.sites.outcome"),
              price: t("offers.cards.sites.price", { price: price("landing") }),
            },
            {
              href: "/services/agents-ia",
              name: t("offers.cards.agents.name"),
              outcome: t("offers.cards.agents.outcome"),
              price: t("offers.cards.agents.price", {
                price: price("audit-ia"),
              }),
            },
            {
              href: "/forward-deployed-engineer",
              name: t("offers.cards.fde.name"),
              outcome: t("offers.cards.fde.outcome"),
              price: t("offers.cards.fde.price", { price: price("fde") }),
            },
          ]}
        />
      </Background>

      <CaseGrid
        title={t("cases.title")}
        subtitle={t("cases.subtitle")}
        viewAllLabel={t("cases.viewAll")}
        readLabel={t("cases.readCase")}
        items={cases.slice(0, HOME_CASE_COUNT)}
        className="pt-20 lg:pt-28"
      />

      <ProcessSteps
        title={t("process.title")}
        steps={messageList(t, "process.steps", ["title", "body"])}
      />

      <Founder
        title={t("founder.title")}
        body={t("founder.body")}
        experience={t("founder.experience")}
        aboutLabel={t("founder.about")}
        links={[
          { label: t("founder.github"), href: site.socials.github },
          { label: t("founder.linkedin"), href: site.socials.linkedinFounder },
        ]}
      />

      <Testimonials
        title={t("testimonials.title")}
        note={t("testimonials.note")}
        items={messageList(t, "testimonials.items", [
          "quote",
          "author",
          "company",
        ])}
      />

      <Background variant="bottom">
        <Faq
          title={t("faq.title")}
          items={messageList(t, "faq.items", ["question", "answer"], prices)}
          bookLabel={nav("book")}
        />
        <Cta
          title={t("finalCta.title")}
          body={t("finalCta.body")}
          primary={{ action: "book", label: t("finalCta.ctaPrimary") }}
          secondary={{ action: "quote", label: t("finalCta.ctaSecondary") }}
        />
      </Background>
    </>
  );
}
