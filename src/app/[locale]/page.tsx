import type { Metadata } from "next";

import {
  CircleCheck,
  Globe,
  KeyRound,
  List,
  MessageSquareQuote,
  Shield,
  UserCheck,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

import { ActionButton } from "@/components/action-button";
import {
  ACCENT_LEVEL_FILLS,
  ContributionGraph,
} from "@/components/proof/contribution-graph";
import { Button } from "@/components/ui/button";
import { CaseCarousel } from "@/components/ui-kit/case-carousel";
import { CaseRow } from "@/components/ui-kit/case-row";
import { CenteredHero } from "@/components/ui-kit/centered-hero";
import { ClientsRow } from "@/components/ui-kit/clients-row";
import { ConstellationBackdrop } from "@/components/ui-kit/constellation-backdrop";
import { FaqList } from "@/components/ui-kit/faq-list";
import { FounderCard } from "@/components/ui-kit/founder-card";
import {
  CallMock,
  HandoverMock,
  QuoteMock,
  UpdateMock,
} from "@/components/ui-kit/method-mocks";
import { MethodSteps } from "@/components/ui-kit/method-steps";
import {
  CatalogueLinks,
  OfferCard,
  OfferRow,
} from "@/components/ui-kit/offer-card";
import {
  AgentIllustration,
  SiteIllustration,
  TeamIllustration,
} from "@/components/ui-kit/offer-illustrations";
import { PageSection } from "@/components/ui-kit/page-section";
import { SiteCta } from "@/components/ui-kit/site-cta";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { ToolsStrip } from "@/components/ui-kit/tools-strip";
import { TrustGrid } from "@/components/ui-kit/trust-grid";
import { UseCaseCard } from "@/components/ui-kit/use-case-card";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { getCaseStudies } from "@/lib/content";
import {
  ALSO_OFFERS,
  HERO_DESTINATIONS,
  HERO_SOURCES,
  HOME_CAROUSEL,
  HOME_CASE_ROWS,
  HOME_CLIENTS,
  HOME_FAQ,
  HOME_OFFER_CARDS,
  HOME_TOOLS,
  HOME_TRUST,
  HOME_USE_CASES,
  OTHER_TOOL_COUNT,
  selectHomeCases,
} from "@/lib/home-sections";
import { formatPrice, getOfferPrice, getPriceValues } from "@/lib/offers";
import { getGithubContributions, getSiteShot } from "@/lib/proof";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const FOUNDER_PHOTO = "/team/maxime-mansiet.jpg";

const TRUST_ICONS = {
  owned: KeyRound,
  training: Shield,
  europe: Globe,
  human: UserCheck,
  log: List,
  tested: CircleCheck,
} as const;

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
  const cases = selectHomeCases(await getCaseStudies(locale));
  const contributions = getGithubContributions();
  const citeme = getSiteShot("citeme");
  const prices = getPriceValues(locale);
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale).format(value).replaceAll("\u202f", "\u00a0");
  const day = (date: string) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(date));

  const casesBySlug = new Map(cases.map((study) => [study.slug, study]));
  const carousel = HOME_CAROUSEL.filter(({ slug }) => casesBySlug.has(slug));
  const rows = HOME_CASE_ROWS.flatMap(({ slug, name }) => {
    const item = casesBySlug.get(slug);
    return item ? [{ item, name }] : [];
  });

  const illustrations = {
    sites: <SiteIllustration domain={t("offers.art.domain")} />,
    agents: (
      <AgentIllustration
        from="gmail"
        to="hubspot"
        label={t("offers.art.agent")}
        caption={t("offers.art.agentCaption")}
      />
    ),
    fde: (
      <TeamIllustration
        photo={FOUNDER_PHOTO}
        caption={t("offers.art.teamCaption")}
      />
    ),
  };

  return (
    <>
      <CenteredHero
        data-home-hero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        backdrop={
          <ConstellationBackdrop
            sources={HERO_SOURCES}
            destinations={HERO_DESTINATIONS}
          />
        }
        actions={
          <>
            <ActionButton action="book" size="xl" trackLocation="hero">
              {t("hero.ctaPrimary")}
            </ActionButton>
            <Button variant="outline" size="xl" asChild>
              <Link href="/realisations">{t("hero.ctaSecondary")}</Link>
            </Button>
          </>
        }
        footer={<ClientsRow label={t("hero.clients")} names={HOME_CLIENTS} />}
      />

      <PageSection id="outils" containerClassName="py-11 lg:py-11">
        <ToolsStrip
          title={t("tools.title")}
          tools={HOME_TOOLS}
          more={t("tools.more", { count: OTHER_TOOL_COUNT })}
        />
      </PageSection>

      <PageSection id="offres" containerClassName="lg:pt-30">
        <SectionHeader title={t("offers.title")} intro={t("offers.intro")} />
        <OfferRow className="mt-12">
          {HOME_OFFER_CARDS.map(({ key, href, offer }) => (
            <OfferCard
              key={key}
              name={t(`offers.cards.${key}.name`)}
              audience={t(`offers.cards.${key}.audience`)}
              body={t(`offers.cards.${key}.body`)}
              priceLabel={t("offers.from")}
              price={t(`offers.cards.${key}.price`, {
                price: formatPrice(getOfferPrice(offer), locale),
              })}
              unit={key === "fde" ? t("offers.cards.fde.unit") : undefined}
              duration={t(`offers.cards.${key}.duration`)}
              href={href}
              linkLabel={t("offers.link")}
              illustration={illustrations[key]}
            />
          ))}
        </OfferRow>
        <CatalogueLinks
          className="mt-8"
          label={t("offers.also.label")}
          items={ALSO_OFFERS.map(({ key, href }) => ({
            label: t(`offers.also.${key}`),
            href,
          }))}
        />
      </PageSection>

      <PageSection id="cas-usage">
        <SectionHeader
          title={t("useCases.title")}
          intro={t("useCases.intro")}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {HOME_USE_CASES.map(({ key, from, to }) => (
            <UseCaseCard
              key={key}
              category={t(`useCases.items.${key}.category`)}
              title={t(`useCases.items.${key}.title`)}
              from={from}
              to={to}
              agentLabel={t("useCases.agent")}
              before={{
                label: t("useCases.before"),
                text: t(`useCases.items.${key}.before`),
              }}
              after={{
                label: t("useCases.after"),
                text: t(`useCases.items.${key}.after`),
              }}
            />
          ))}
        </div>
      </PageSection>

      {cases.length > 0 && (
        <PageSection id="realisations" containerClassName="lg:pt-30">
          <SectionHeader title={t("work.title")} intro={t("work.intro")} />
          {carousel.length > 0 && (
            <CaseCarousel
              className="mt-8"
              labels={{
                tabs: t("work.tabs"),
                need: t("work.need"),
                built: t("work.built"),
                result: t("work.result"),
                read: t("work.read"),
              }}
              items={carousel.map(({ key, slug, image }) => ({
                id: key,
                slug,
                image,
                stack: casesBySlug.get(slug)?.stack.join(", ") ?? "",
                tab: t(`work.items.${key}.tab`),
                client: t(`work.items.${key}.client`),
                title: t(`work.items.${key}.title`),
                need: t(`work.items.${key}.need`),
                built: t(`work.items.${key}.built`),
                result: t(`work.items.${key}.result`),
                alt: t(`work.items.${key}.alt`),
              }))}
            />
          )}
          {rows.length > 0 && (
            <div className="mt-8 flex flex-col">
              {rows.map(({ item, name }) => (
                <CaseRow
                  key={item.slug}
                  slug={item.slug}
                  name={name}
                  kind={t(`work.rows.${item.slug}.kind`)}
                  summary={t(`work.rows.${item.slug}.summary`)}
                  meta={[...item.stack.slice(0, 2), item.year].join(", ")}
                  image={item.image}
                />
              ))}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              asChild
              className="h-11 rounded-[10px] px-5"
            >
              <Link href="/realisations">{t("work.viewAll")}</Link>
            </Button>
          </div>
        </PageSection>
      )}

      <PageSection id="methode">
        <SectionHeader title={t("method.title")} intro={t("method.intro")} />
        <MethodSteps
          className="mt-12"
          steps={[
            {
              when: t("method.steps.call.when"),
              title: t("method.steps.call.title"),
              body: t("method.steps.call.body"),
              mock: (
                <CallMock
                  month={t("method.mocks.call.month")}
                  day={t("method.mocks.call.day")}
                  title={t("method.mocks.call.title")}
                  time={t("method.mocks.call.time")}
                  people={t("method.mocks.call.people")}
                  avatar={FOUNDER_PHOTO}
                />
              ),
            },
            {
              when: t("method.steps.quote.when"),
              title: t("method.steps.quote.title"),
              body: t("method.steps.quote.body"),
              mock: (
                <QuoteMock
                  label={t("method.mocks.quote.label")}
                  title={t("method.mocks.quote.title")}
                  items={["a", "b", "c"].map((id) =>
                    t(`method.mocks.quote.items.${id}`),
                  )}
                  excluded={t("method.mocks.quote.excluded")}
                  total={t("method.mocks.quote.total")}
                  price={prices.sprintPrice}
                />
              ),
            },
            {
              when: t("method.steps.build.when"),
              title: t("method.steps.build.title"),
              body: t("method.steps.build.body"),
              mock: (
                <UpdateMock
                  from={t("method.mocks.build.from")}
                  time={t("method.mocks.build.time")}
                  title={t("method.mocks.build.title")}
                  next={t("method.mocks.build.next")}
                  channel={t("method.mocks.build.channel")}
                  avatar={FOUNDER_PHOTO}
                  items={[
                    { label: t("method.mocks.build.items.a"), done: true },
                    { label: t("method.mocks.build.items.b"), done: true },
                    { label: t("method.mocks.build.items.c"), done: false },
                  ]}
                />
              ),
            },
            {
              when: t("method.steps.handover.when"),
              title: t("method.steps.handover.title"),
              body: t("method.steps.handover.body"),
              mock: (
                <HandoverMock
                  title={t("method.mocks.handover.title")}
                  live={t("method.mocks.handover.live")}
                  items={["a", "b", "c", "d"].map((id) =>
                    t(`method.mocks.handover.items.${id}`),
                  )}
                />
              ),
            },
          ]}
        />
      </PageSection>

      <PageSection id="donnees">
        <SectionHeader title={t("trust.title")} intro={t("trust.intro")} />
        <TrustGrid
          className="mt-12"
          items={HOME_TRUST.map((key) => ({
            icon: TRUST_ICONS[key],
            title: t(`trust.items.${key}.title`),
            body: t(`trust.items.${key}.body`),
          }))}
          footer={{
            label: t("trust.models"),
            models: [
              { logo: "openai", name: "OpenAI" },
              { logo: "claude", name: t("trust.anthropic") },
              {
                logo: "mistral-ai",
                name: "Mistral AI",
                note: t("trust.french"),
              },
            ],
          }}
        />
      </PageSection>

      <PageSection id="equipe">
        <SectionHeader title={t("team.title")} intro={t("team.intro")} />
        <FounderCard
          className="mt-12"
          name={t("team.name")}
          role={t("team.role")}
          bio={t("team.bio")}
          photo={FOUNDER_PHOTO}
          photoAlt={t("team.photoAlt")}
          stats={[
            ...(contributions
              ? [
                  {
                    value: formatNumber(contributions.total),
                    label: t("team.stats.contributions"),
                  },
                ]
              : []),
            {
              value: formatNumber(cases.length),
              label: t("team.stats.projects"),
            },
            { value: formatNumber(1), label: t("team.stats.contact") },
          ]}
          graph={
            contributions && (
              <ContributionGraph
                data={contributions}
                fills={ACCENT_LEVEL_FILLS}
                cell={9}
                label={t("team.graph", {
                  from: day(contributions.from),
                  to: day(contributions.to),
                })}
              />
            )
          }
          links={[
            ...(contributions
              ? [
                  {
                    label: t("team.links.github"),
                    detail: `@${contributions.user}`,
                    href: site.socials.github,
                    icon: <FaGithub className="text-text size-4" />,
                  },
                ]
              : []),
            {
              label: t("team.links.linkedin"),
              detail: site.founder,
              href: site.socials.linkedinFounder,
              icon: <FaLinkedin className="size-4 text-[#0a66c2]" />,
            },
            ...(citeme
              ? [
                  {
                    label: t("team.links.citeme"),
                    detail: new URL(citeme.url).host.replace(/^www\./, ""),
                    href: citeme.url,
                    icon: (
                      <MessageSquareQuote className="size-4 text-[#7c3aed]" />
                    ),
                  },
                ]
              : []),
          ]}
        />
      </PageSection>

      <PageSection id="faq">
        <FaqList
          title={t("faq.title")}
          intro={t("faq.intro")}
          items={HOME_FAQ.map((key) => ({
            question: t(`faq.items.${key}.question`),
            answer: t(`faq.items.${key}.answer`, prices),
          }))}
        />
      </PageSection>

      <SiteCta />
    </>
  );
}
