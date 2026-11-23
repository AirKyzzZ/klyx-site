import type { Metadata } from "next";

import {
  ArrowRight,
  ArrowUpRight,
  KeyRound,
  MapPin,
  ScrollText,
  UserCheck,
  Video,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { GirondeMap } from "@/components/gironde-map";
import { JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/sections/faq";
import {
  fourSteps,
  MethodSection,
} from "@/components/templates/method-section";
import { PriceCards } from "@/components/templates/price-cards";
import { Button } from "@/components/ui/button";
import { CaseRow } from "@/components/ui-kit/case-row";
import { ComparisonList } from "@/components/ui-kit/comparison-list";
import { FactCard } from "@/components/ui-kit/fact-card";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { SiteCta } from "@/components/ui-kit/site-cta";
import { SplitHero } from "@/components/ui-kit/split-hero";
import { TrustGrid } from "@/components/ui-kit/trust-grid";
import { UseCaseCard } from "@/components/ui-kit/use-case-card";
import { messageKeys, messageList, type Translate } from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import {
  BORDEAUX_BLOG_PILLAR,
  BORDEAUX_EXAMPLES,
  BORDEAUX_OFFERS,
  BORDEAUX_PLACES,
  LOCAL_CASES,
} from "@/lib/bordeaux-page";
import { getCaseStudies } from "@/lib/content";
import { trailPageJsonLd } from "@/lib/json-ld";
import { getOfferCopy } from "@/lib/offer-copy";
import { formatPrice, getOfferPrice, getPriceValues } from "@/lib/offers";
import { buildMetadata } from "@/lib/seo";

const CONSULTANT_ICONS = {
  audit: ScrollText,
  person: UserCheck,
  owned: KeyRound,
} as const;

const textLink =
  "text-text hover:text-accent inline-flex w-fit items-center gap-1.5 font-medium underline decoration-1 underline-offset-[3px] transition-colors duration-(--d-fast)";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.bordeaux" });
  return buildMetadata({
    locale,
    pathname: "/agence-ia-bordeaux",
    title: t("title"),
    description: t("description", getPriceValues(locale)),
  });
}

export default async function BordeauxPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "bordeaux" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const prices = getPriceValues(locale);
  const faq = messageList(t, "faq.items", ["question", "answer"], prices);
  const offersT = (await getTranslations({
    locale,
    namespace: "offers",
  })) as Translate;
  const audit = getOfferCopy(offersT, locale, "audit-ia");
  const studies = await getCaseStudies(locale);
  const cases = LOCAL_CASES.flatMap((slug) => {
    const study = studies.find((item) => item.slug === slug);
    return study ? [study] : [];
  });

  return (
    <>
      <JsonLd
        data={trailPageJsonLd({
          locale,
          trail: [{ name: nav("bordeaux"), pathname: "/agence-ia-bordeaux" }],
          offerIds: BORDEAUX_OFFERS,
          faq,
        })}
      />

      <SplitHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        actions={
          <>
            <ActionButton action="book" size="xl" trackLocation="hero">
              {t("labels.book")}
            </ActionButton>
            <ActionButton
              action="quote"
              variant="outline"
              size="xl"
              trackLocation="hero"
            >
              {t("labels.quote")}
            </ActionButton>
          </>
        }
        aside={
          <FactCard
            visual={
              <GirondeMap
                label={t("hero.map")}
                places={{
                  bordeaux: t("hero.mapBordeaux"),
                  arcachon: t("hero.mapBassin"),
                }}
                className="h-[220px] w-auto sm:h-[250px]"
              />
            }
            facts={[
              { label: t("labels.audience"), value: t("hero.audience") },
              { label: t("labels.zone"), value: t("hero.zone") },
            ]}
            price={{
              label: t("labels.from"),
              value: formatPrice(getOfferPrice("audit-ia"), locale),
              note: `${audit.name}, ${audit.duration}`,
            }}
          />
        }
      />

      <PageSection id="probleme">
        <SectionHeader title={t("problem.title")} intro={t("problem.intro")}>
          <a
            href={t("problem.sourceUrl")}
            target="_blank"
            rel="noopener"
            className="text-text-3 hover:text-text inline-flex w-fit items-center gap-1 text-[0.8125rem] underline underline-offset-4 transition-colors duration-(--d-fast)"
          >
            {t("problem.source")}
            <ArrowUpRight aria-hidden="true" className="size-3" />
          </a>
        </SectionHeader>
        <ComparisonList
          className="mt-12"
          items={messageKeys(t.raw("problem.items")).map((key) => ({
            title: t(`problem.items.${key}.title`),
            before: {
              label: t("labels.before"),
              text: t(`problem.items.${key}.before`),
            },
            after: {
              label: t("labels.after"),
              text: t(`problem.items.${key}.after`),
            },
          }))}
        />
      </PageSection>

      <PageSection id="exemples">
        <SectionHeader title={t("examples.title")} intro={t("examples.intro")}>
          <Link href="/cas-usage" className={`${textLink} text-[0.9375rem]`}>
            {t("examples.link")}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </SectionHeader>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {BORDEAUX_EXAMPLES.map(({ id, from, to }) => (
            <UseCaseCard
              key={id}
              category={t(`examples.items.${id}.category`)}
              title={t(`examples.items.${id}.title`)}
              from={from}
              to={to}
              agentLabel={t("labels.agentPill")}
              before={{
                label: t("labels.agent"),
                text: t(`examples.items.${id}.agent`),
              }}
              after={{
                label: t("labels.team"),
                text: t(`examples.items.${id}.team`),
              }}
            />
          ))}
        </div>
      </PageSection>

      <PageSection id="consultant-ia">
        <SectionHeader
          title={t("consultant.title")}
          intro={t("consultant.intro")}
        />
        <TrustGrid
          className="mt-12"
          items={(["audit", "person", "owned"] as const).map((key) => ({
            icon: CONSULTANT_ICONS[key],
            title: t(`consultant.items.${key}.title`),
            body: t(`consultant.items.${key}.body`, prices),
          }))}
        />
        <div className="mt-8 flex flex-col gap-x-8 gap-y-3 text-[0.9375rem] md:flex-row md:items-baseline md:justify-between">
          <p className="text-text-2 leading-normal">
            {t("consultant.blogLead")}{" "}
            <Link
              href={{
                pathname: "/blog/[slug]",
                params: { slug: BORDEAUX_BLOG_PILLAR },
              }}
              className={textLink}
            >
              {t("consultant.blogLink")}
            </Link>
          </p>
          <Link href="/services/audit-ia" className={`${textLink} shrink-0`}>
            {t("consultant.auditLink")}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </PageSection>

      <PageSection id="tarifs">
        <SectionHeader title={t("pricing.title")} intro={t("pricing.intro")} />
        <PriceCards
          className="mt-12"
          locale={locale}
          labels={{
            from: t("labels.from"),
            perDay: "",
            viewOffer: t("labels.viewOffer"),
          }}
          cards={BORDEAUX_OFFERS.map((id) => ({
            id,
            audience: t(`pricing.cards.${id}.audience`),
            body: t(`pricing.cards.${id}.body`),
          }))}
        />
        <div className="mt-8 flex justify-end text-[0.9375rem]">
          <Link href="/tarifs" className={textLink}>
            {t("labels.allPricing")}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </PageSection>

      <MethodSection
        locale={locale}
        title={t("method.title")}
        intro={t("method.intro")}
        steps={fourSteps(
          messageList(t as Translate, "method.steps", [
            "when",
            "title",
            "body",
          ]),
        )}
        quote={{
          title: t("method.quote.title"),
          items: ["a", "b", "c"].map((id) => t(`method.quote.items.${id}`)),
          excluded: t("method.quote.excluded"),
          offer: "audit-ia",
        }}
        updates={[
          t("method.update.a"),
          t("method.update.b"),
          t("method.update.c"),
        ]}
      />

      <PageSection id="zone">
        <SectionHeader title={t("zone.title")} intro={t("zone.intro")} />
        <ul
          data-zone
          className="border-line bg-line mt-12 grid gap-px overflow-hidden rounded-[20px] border sm:grid-cols-2 lg:grid-cols-4"
        >
          {BORDEAUX_PLACES.map((key) => {
            const Icon = key === "remote" ? Video : MapPin;
            return (
              <li
                key={key}
                className="bg-surface-1 flex items-start gap-3.5 p-5 sm:p-6"
              >
                <span className="bg-accent-tint text-accent grid size-9 shrink-0 place-items-center rounded-[10px]">
                  <Icon
                    aria-hidden="true"
                    className="size-[18px]"
                    strokeWidth={1.75}
                  />
                </span>
                <span className="flex flex-col gap-1 pt-0.5">
                  <span className="text-text text-base leading-tight font-semibold tracking-[-0.2px]">
                    {t(`zone.places.${key}.name`)}
                  </span>
                  <span className="text-text-3 text-[0.8125rem] leading-snug">
                    {t(`zone.places.${key}.note`)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </PageSection>

      {cases.length > 0 && (
        <PageSection id="realisations-locales">
          <SectionHeader title={t("local.title")} intro={t("local.intro")} />
          <div className="mt-10 flex flex-col">
            {cases.map((study) => (
              <CaseRow
                key={study.slug}
                slug={study.slug}
                name={study.title}
                kind={t(`local.cases.${study.slug}`)}
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
              <Link href="/realisations">{t("labels.allCases")}</Link>
            </Button>
          </div>
        </PageSection>
      )}

      <Faq
        id="faq"
        title={t("faq.title")}
        items={faq}
        bookLabel={t("labels.book")}
        openFirst
      />

      <SiteCta title={t("cta.title")} body={t("cta.body")} />
    </>
  );
}
