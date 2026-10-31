import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { Button } from "@/components/ui/button";
import { CaseGrid } from "@/components/sections/case-grid";
import { Cta } from "@/components/sections/cta";
import { JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/sections/faq";
import { Hero, HeroList } from "@/components/sections/hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { Statement } from "@/components/sections/statement";
import { TierCards } from "@/components/sections/tier-cards";
import { messageList, messageStrings } from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getCaseStudies } from "@/lib/content";
import { getOfferCopy } from "@/lib/offer-copy";
import { getPriceValues } from "@/lib/offers";
import { offerPageJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";

const TIERS = ["audit-ia", "sprint-ia", "retainer"] as const;
const HIGHLIGHTED_TIER = "sprint-ia";
const PROOF_SLUGS = ["hop-hop-immo", "citeme"];

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.agents" });
  return buildMetadata({
    locale,
    pathname: "/services/agents-ia",
    title: t("title"),
    description: t("description", getPriceValues(locale)),
  });
}

export default async function AgentsPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "agents" });
  const offersT = await getTranslations({ locale, namespace: "offers" });
  const casesT = await getTranslations({ locale, namespace: "cases.labels" });
  const prices = getPriceValues(locale);
  const faq = messageList(t, "faq.items", ["question", "answer"], prices);
  const tiers = TIERS.map((id) => getOfferCopy(offersT, locale, id));
  const cases = (await getCaseStudies(locale)).filter((c) =>
    PROOF_SLUGS.includes(c.slug),
  );

  return (
    <>
      <JsonLd
        data={offerPageJsonLd({
          locale,
          pathname: "/services/agents-ia",
          navKey: "agents",
          offerIds: TIERS,
          faq,
        })}
      />
      <Background>
        <Hero
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          emphasis={t("hero.titleEmphasis")}
          subtitle={t("hero.subtitle", prices)}
          primary={{ action: "book", label: t("hero.ctaPrimary") }}
          secondary={{ action: "quote", label: t("hero.ctaSecondary") }}
          aside={
            <HeroList
              items={tiers.map((tier) => ({
                title: tier.name,
                meta: tier.price,
                body: tier.duration,
              }))}
            />
          }
        />
      </Background>

      <Statement
        rows={[{ title: t("problem.title"), paragraphs: [t("problem.body")] }]}
      />

      <TierCards
        title={t("deliverables.title")}
        subtitle={t("deliverables.subtitle")}
        quoteLabel={t("cta.ctaSecondary")}
        footnote={offersT("vatNote")}
        tiers={tiers.map((tier) => ({
          name: tier.name,
          price: tier.price,
          duration: tier.duration,
          summary: tier.summary,
          features: messageStrings(t, `deliverables.tiers.${tier.key}.items`),
          highlighted: tier.id === HIGHLIGHTED_TIER,
        }))}
      />

      <ProcessSteps
        title={t("process.title")}
        steps={messageList(t, "process.steps", ["title", "body"])}
      />

      <Statement
        className="pt-0 lg:pt-0"
        rows={[
          { title: t("credit.title"), paragraphs: [t("credit.body")] },
          {
            title: t("pricing.title"),
            paragraphs: [t("pricing.body", prices)],
            children: (
              <Button variant="outline" className="shadow-md" asChild>
                <Link href="/tarifs">{t("pricing.link")}</Link>
              </Button>
            ),
          },
          {
            title: t("proof.title"),
            paragraphs: [t("proof.body")],
            children: (
              <Button variant="outline" className="shadow-md" asChild>
                <Link href="/realisations">{t("proof.link")}</Link>
              </Button>
            ),
          },
        ]}
      />
      <CaseGrid
        items={cases}
        readLabel={casesT("read")}
        className="pt-0 lg:pt-0"
      />

      <Background variant="bottom">
        <Faq
          title={t("faq.title")}
          items={faq}
          bookLabel={t("cta.ctaPrimary")}
        />
        <Cta
          title={t("cta.title")}
          body={t("cta.body")}
          primary={{ action: "book", label: t("cta.ctaPrimary") }}
          secondary={{ action: "quote", label: t("cta.ctaSecondary") }}
        />
      </Background>
    </>
  );
}
