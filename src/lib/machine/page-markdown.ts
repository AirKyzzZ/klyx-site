import {
  messageKeys,
  messageList,
  messageStrings,
  type Translate,
} from "@/i18n/message-list";
import { type Locale, routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { getPostSummaries, postServices } from "@/lib/blog";
import {
  getCaseStudies,
  getMdxBody,
  getPosts,
  readingMinutes,
} from "@/lib/content";
import type { CaseStudyMeta } from "@/lib/content";
import {
  ALSO_OFFERS,
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
import { getOfferCopy } from "@/lib/offer-copy";
import { type OfferPageConfig, offerPages } from "@/lib/offer-pages";
import {
  formatPrice,
  getOfferPrice,
  getPriceValues,
  PRICE_GROUPS,
} from "@/lib/offers";
import { type AppPathname, absoluteUrl } from "@/lib/seo";
import { CREDITS } from "@/lib/credits";
import { getGithubContributions, getVerifiedProof } from "@/lib/proof";
import { faqThemes } from "@/lib/faq-page";
import { followingItems } from "@/lib/related-content";
import { scenarios } from "@/lib/scenarios";
import {
  SECTOR_KEYS,
  type SectorPageConfig,
  sectorPages,
} from "@/lib/sector-pages";
import { site, socialLinks } from "@/lib/site";
import { DEPLOYED_TECH, type ToolGroup } from "@/lib/tools";

import type { MachinePage } from "./markdown-href";

export type { MachinePage } from "./markdown-href";

type Params = Record<string, string>;
type Builder = (locale: Locale, params: Params) => Promise<string | null>;
type Block = string | null | undefined | false;
type Action = "book" | "quote";
type Faq = { question: string; answer: string };

const METHOD_STEPS = ["call", "quote", "build", "handover"] as const;
const ABOUT_TEAM = ["lead", "agents", "specialists"] as const;
const ABOUT_FACTS = ["company", "location", "languages", "tools"] as const;
const ABOUT_TRUST = [
  "code",
  "prices",
  "quote",
  "owned",
  "handover",
  "honest",
] as const;

function doc(blocks: Block[]): string {
  return `${blocks.filter((block): block is string => Boolean(block)).join("\n\n")}\n`;
}

function list(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function link(label: string, url: string): string {
  return `[${label}](${url})`;
}

function labelled(locale: Locale, label: string, value: string): string {
  return `${label}${locale === "fr" ? " : " : ": "}${value}`;
}

function cell(text: string): string {
  return text
    .replace(/[\r\n\t ]+/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function heroTitle(t: Translate): string {
  return `${t("hero.title")} ${t("hero.titleEmphasis")}`;
}

function sectionTitle(t: Translate, key: string): string {
  const raw = t.raw(key);
  const split =
    typeof raw === "object" && raw !== null && "titleEmphasis" in raw;
  return split
    ? `${t(`${key}.title`)} ${t(`${key}.titleEmphasis`)}`
    : t(`${key}.title`);
}

function intro(
  locale: Locale,
  pathname: AppPathname,
  h1: string,
  params: Params = {},
): Block[] {
  return [`# ${h1}`, `<${absoluteUrl(locale, pathname, params)}>`];
}

function actionUrl(locale: Locale, action: Action): string {
  if (action === "book" && site.calUrl) return site.calUrl;
  return absoluteUrl(locale, "/contact");
}

function faqBlocks(title: string, items: Faq[]): Block[] {
  return [
    `## ${title}`,
    ...items.flatMap((item) => [`### ${item.question}`, item.answer]),
  ];
}

function processBlocks(locale: Locale, t: Translate): Block[] {
  const steps = messageList(t, "process.steps", ["title", "body"]);
  return [
    `## ${sectionTitle(t, "process")}`,
    steps
      .map(
        (step, i) =>
          `${i + 1}. ${labelled(locale, `**${step.title}**`, step.body)}`,
      )
      .join("\n"),
  ];
}

function ctaBlocks(
  locale: Locale,
  t: Translate,
  key: string,
  actions: [Action, Action],
): Block[] {
  return [
    `## ${sectionTitle(t, key)}`,
    t(`${key}.body`),
    list([
      link(t(`${key}.ctaPrimary`), actionUrl(locale, actions[0])),
      link(t(`${key}.ctaSecondary`), actionUrl(locale, actions[1])),
    ]),
  ];
}

function siteCtaBlocks(locale: Locale, t: Translate): Block[] {
  return [
    `## ${t("cta.title")}`,
    t("cta.body"),
    list([
      link(
        getStaticTranslator(locale, "home")("hero.ctaPrimary"),
        actionUrl(locale, "book"),
      ),
      link(t("cta.secondary"), actionUrl(locale, "quote")),
    ]),
  ];
}

function caseList(locale: Locale, cases: CaseStudyMeta[]): Block {
  if (cases.length === 0) return null;
  return list(
    cases.map((c) =>
      labelled(
        locale,
        link(
          c.title,
          absoluteUrl(locale, "/realisations/[slug]", { slug: c.slug }),
        ),
        `${c.client} · ${c.year}. ${c.summary}`,
      ),
    ),
  );
}

function toolBlocks(
  locale: Locale,
  t: Translate,
  key: string,
  groups: ToolGroup[],
  title = sectionTitle(t, key),
): Block[] {
  return [
    `## ${title}`,
    t(`${key}.body`),
    `### ${t(`${key}.label`)}`,
    list(
      groups.map((group) =>
        labelled(
          locale,
          t(`${key}.groups.${group.key}`),
          group.tools.map((tool) => tool.name).join(", "),
        ),
      ),
    ),
    t(`${key}.note`),
  ];
}

function formatDate(locale: Locale, date: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(date));
}

async function home(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "home");
  const prices = getPriceValues(locale);
  const cases = selectHomeCases(await getCaseStudies(locale));
  const bySlug = new Map(cases.map((study) => [study.slug, study]));
  const contributions = getGithubContributions();
  const caseUrl = (slug: string) =>
    absoluteUrl(locale, "/realisations/[slug]", { slug });

  return doc([
    ...intro(locale, "/", t("hero.title")),
    t("hero.subtitle"),
    list([
      link(t("hero.ctaPrimary"), actionUrl(locale, "book")),
      link(t("hero.ctaSecondary"), absoluteUrl(locale, "/realisations")),
    ]),
    labelled(locale, t("hero.clients"), HOME_CLIENTS.join(", ")),
    labelled(
      locale,
      t("tools.title"),
      [
        ...HOME_TOOLS.map((tool) => tool.name),
        t("tools.more", { count: OTHER_TOOL_COUNT }),
      ].join(", "),
    ),
    `## ${t("offers.title")}`,
    t("offers.intro"),
    ...HOME_OFFER_CARDS.flatMap(({ key, href, offer }) => {
      const price = t(`offers.cards.${key}.price`, {
        price: formatPrice(getOfferPrice(offer), locale),
      });
      const unit = key === "fde" ? ` ${t("offers.cards.fde.unit")}` : "";
      return [
        `### ${t(`offers.cards.${key}.name`)}`,
        `**${t(`offers.cards.${key}.audience`)}** ${t(`offers.cards.${key}.body`)}`,
        `${t("offers.from")} ${price}${unit} · ${t(`offers.cards.${key}.duration`)}`,
        link(t("offers.link"), absoluteUrl(locale, href)),
      ];
    }),
    labelled(
      locale,
      t("offers.also.label"),
      ALSO_OFFERS.map(({ key, href }) =>
        link(t(`offers.also.${key}`), absoluteUrl(locale, href)),
      ).join(" · "),
    ),
    `## ${t("useCases.title")}`,
    t("useCases.intro"),
    ...HOME_USE_CASES.flatMap(({ key }) => [
      `### ${t(`useCases.items.${key}.title`)} (${t(`useCases.items.${key}.category`)})`,
      list([
        labelled(
          locale,
          t("useCases.before"),
          t(`useCases.items.${key}.before`),
        ),
        labelled(locale, t("useCases.after"), t(`useCases.items.${key}.after`)),
      ]),
    ]),
    cases.length > 0 && `## ${t("work.title")}`,
    cases.length > 0 && t("work.intro"),
    ...HOME_CAROUSEL.filter(({ slug }) => bySlug.has(slug)).flatMap(
      ({ key, slug }) => [
        `### ${t(`work.items.${key}.title`)}`,
        list([
          labelled(locale, t("work.need"), t(`work.items.${key}.need`)),
          labelled(locale, t("work.built"), t(`work.items.${key}.built`)),
          labelled(locale, t("work.result"), t(`work.items.${key}.result`)),
        ]),
        link(t("work.read"), caseUrl(slug)),
      ],
    ),
    list(
      HOME_CASE_ROWS.filter(({ slug }) => bySlug.has(slug)).map(
        ({ slug, name }) =>
          labelled(
            locale,
            link(name, caseUrl(slug)),
            `${t(`work.rows.${slug}.kind`)}. ${t(`work.rows.${slug}.summary`)}`,
          ),
      ),
    ),
    cases.length > 0 &&
      link(t("work.viewAll"), absoluteUrl(locale, "/realisations")),
    `## ${t("method.title")}`,
    t("method.intro"),
    METHOD_STEPS.map(
      (step, i) =>
        `${i + 1}. ${labelled(
          locale,
          `**${t(`method.steps.${step}.title`)}**`,
          `${t(`method.steps.${step}.when`)}. ${t(`method.steps.${step}.body`)}`,
        )}`,
    ).join("\n"),
    `## ${t("trust.title")}`,
    t("trust.intro"),
    list(
      HOME_TRUST.map((key) =>
        labelled(
          locale,
          `**${t(`trust.items.${key}.title`)}**`,
          t(`trust.items.${key}.body`),
        ),
      ),
    ),
    labelled(
      locale,
      t("trust.models"),
      `OpenAI, ${t("trust.anthropic")}, Mistral AI (${t("trust.french")})`,
    ),
    `## ${t("team.title")}`,
    t("team.intro"),
    `**${t("team.name")}**, ${t("team.role")}`,
    t("team.bio"),
    list([
      ...(contributions
        ? [
            `${new Intl.NumberFormat(locale).format(contributions.total)} ${t("team.stats.contributions")}`,
          ]
        : []),
      `${cases.length} ${t("team.stats.projects")}`,
      `1 ${t("team.stats.contact")}`,
    ]),
    list([
      link(t("team.links.github"), site.socials.github),
      link(t("team.links.linkedin"), site.socials.linkedinFounder),
    ]),
    ...faqBlocks(
      t("faq.title"),
      HOME_FAQ.map((key) => ({
        question: t(`faq.items.${key}.question`),
        answer: t(`faq.items.${key}.answer`, prices),
      })),
    ),
    t("faq.intro"),
    `## ${t("cta.title")}`,
    t("cta.body"),
    list([
      link(t("hero.ctaPrimary"), actionUrl(locale, "book")),
      link(t("cta.secondary"), actionUrl(locale, "quote")),
    ]),
  ]);
}

function hasChild(t: Translate, key: string, child: string): boolean {
  const raw = t.raw(key);
  return typeof raw === "object" && raw !== null && child in raw;
}

function card(t: Translate, key: string, values?: Prices): Block[] {
  return [`### ${t(`${key}.title`)}`, t(`${key}.body`, values)];
}

type Prices = ReturnType<typeof getPriceValues>;

function automationExampleBlocks(t: Translate): Block[] {
  return [
    `## ${sectionTitle(t, "block")}`,
    t("block.body"),
    ...messageKeys(t.raw("block.examples")).flatMap((id) => [
      `### ${t(`block.examples.${id}.title`)}`,
      ["trigger", "ai", "human", "action"]
        .map((step) => t(`block.examples.${id}.steps.${step}`))
        .join(" → "),
      t(`block.examples.${id}.body`),
    ]),
    t("block.limit"),
  ];
}

function blockMarkdown(
  locale: Locale,
  config: OfferPageConfig,
  t: Translate,
): Block[] {
  const root = getStaticTranslator(locale, "");
  switch (config.block) {
    case "trace": {
      const scenario = scenarios[config.scenario];
      return [
        `## ${sectionTitle(t, "block")}`,
        t("block.body"),
        ...card(t, "credit"),
        list(scenario.trace.map((line) => `${line.t} s · ${root(line.key)}`)),
      ];
    }
    case "lighthouse":
      return getVerifiedProof().some((source) => source.kind === "lighthouse")
        ? [`## ${sectionTitle(t, "block")}`, t("block.body")]
        : [];
    case "fde-definition":
      return [
        `## ${sectionTitle(t, "definition")}`,
        `*${t("definition.term")}*`,
        t("definition.body"),
        `## ${t("audience.title")}`,
        t("audience.body"),
        `## ${t("limits.title")}`,
        t("limits.body"),
        list(messageStrings(t, "limits.items")),
      ];
    case "audit-document": {
      const columns = ["process", "hours", "offer", "risk", "when"];
      const rows = messageKeys(t.raw("block.document.rows"));
      return [
        `## ${sectionTitle(t, "block")}`,
        t("block.body"),
        `### ${t("block.document.heading")} (${t("block.document.sample")})`,
        t("block.document.company"),
        [
          `| ${columns.map((c) => cell(t(`block.document.columns.${c}`))).join(" | ")} |`,
          `| ${columns.map(() => "---").join(" | ")} |`,
          ...rows.map(
            (row) =>
              `| ${columns.map((c) => cell(t(`block.document.rows.${row}.${c}`))).join(" | ")} |`,
          ),
        ].join("\n"),
        t("block.document.note"),
        ...card(t, "block.credit"),
        ...card(t, "block.bpifrance"),
        link(t("block.bpifrance.source"), t("block.bpifrance.url")),
      ];
    }
    case "automation-examples":
      return automationExampleBlocks(t);
    case "geo-visibility":
      return [
        `## ${sectionTitle(t, "block")}`,
        t("block.body"),
        `### ${t("block.disclosure.label")}`,
        t("block.disclosure.body"),
      ];
  }
}

async function offerPageMarkdown(
  locale: Locale,
  config: OfferPageConfig,
): Promise<string> {
  const t = getStaticTranslator(locale, config.namespace);
  const offersT = getStaticTranslator(locale, "offers");
  const prices = getPriceValues(locale);
  const tiers = config.tiers.map((id) => getOfferCopy(offersT, locale, id));
  const cases = (await getCaseStudies(locale)).filter((c) =>
    config.proofSlugs.includes(c.slug),
  );
  const proofUrl = absoluteUrl(locale, "/realisations");
  const deliverables: Block[] =
    config.key === "fde"
      ? [
          list(messageStrings(t, "deliverables.items")),
          `### ${t("terms.title")}`,
          list(messageStrings(t, "terms.items", prices)),
        ]
      : tiers.flatMap((tier) => [
          `### ${tier.name}`,
          `${tier.price} · ${tier.duration}`,
          tier.summary,
          list(messageStrings(t, `deliverables.tiers.${tier.key}.items`)),
        ]);

  return doc([
    ...intro(locale, config.pathname, heroTitle(t)),
    config.anchorLine
      ? t("hero.anchor", prices)
      : getOfferCopy(offersT, locale, config.anchor).price,
    t("hero.subtitle", prices),
    `## ${sectionTitle(t, "problem")}`,
    t("problem.body"),
    list(messageStrings(t, "problem.symptoms")),
    `## ${sectionTitle(t, "deliverables")}`,
    hasChild(t, "deliverables", "subtitle") && t("deliverables.subtitle"),
    ...deliverables,
    offersT("vatNote"),
    ...(config.process ? processBlocks(locale, t) : []),
    ...blockMarkdown(locale, config, t),
    ...(config.stack
      ? toolBlocks(
          locale,
          getStaticTranslator(locale, "offerPage"),
          "stack",
          DEPLOYED_TECH,
          `${getStaticTranslator(locale, "offerPage")("stack.title")} ${t("stack.titleEmphasis")}`,
        )
      : []),
    ...(config.proofLink === null
      ? []
      : [
          `## ${sectionTitle(t, "proof")}`,
          t("proof.body"),
          link(t("proof.link"), proofUrl),
          caseList(locale, cases),
        ]),
    ...(config.pricing
      ? [
          `## ${sectionTitle(t, "pricing")}`,
          t("pricing.body", prices),
          list(
            tiers.map((tier) =>
              labelled(
                locale,
                link(tier.name, absoluteUrl(locale, tier.href)),
                `${tier.price} · ${tier.duration}`,
              ),
            ),
          ),
        ]
      : []),
    link(t("pricing.link"), absoluteUrl(locale, "/tarifs")),
    config.sectors.length > 0 &&
      labelled(
        locale,
        getStaticTranslator(locale, "offerPage")("sectors"),
        config.sectors
          .map((key) =>
            link(
              getStaticTranslator(locale, "nav")(key),
              absoluteUrl(locale, sectorPages[key].pathname),
            ),
          )
          .join(" · "),
      ),
    ...faqBlocks(
      sectionTitle(t, "faq"),
      messageList(t, "faq.items", ["question", "answer"], prices),
    ),
    ...ctaBlocks(locale, t, "cta", config.cta),
  ]);
}

async function pricing(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "pricing");
  const offersT = getStaticTranslator(locale, "offers");
  const header = [
    t("table.offer"),
    t("table.includes"),
    t("table.duration"),
    t("table.price"),
  ];

  return doc([
    ...intro(locale, "/tarifs", heroTitle(t)),
    t("hero.subtitle"),
    `## ${t("guarantees.title")}`,
    list(messageStrings(t, "guarantees.items")),
    offersT("vatNote"),
    ...PRICE_GROUPS.flatMap((group) => [
      `## ${t(`table.groups.${group.key}`)}`,
      [
        `| ${header.join(" | ")} |`,
        `| ${header.map(() => "---").join(" | ")} |`,
        ...group.offers.map((id) => {
          const row = getOfferCopy(offersT, locale, id);
          const name = link(row.name, absoluteUrl(locale, row.href));
          return `| ${[name, row.summary, row.duration, row.price].map(cell).join(" | ")} |`;
        }),
      ].join("\n"),
    ]),
    `${t("market.line", getPriceValues(locale))} ${link(t("market.sourceLabel"), t("market.card.rows.tjm.url"))}`,
    ...faqBlocks(
      sectionTitle(t, "faq"),
      messageList(t, "faq.items", ["question", "answer"]),
    ),
    ...ctaBlocks(locale, t, "cta", ["quote", "book"]),
  ]);
}

async function cases(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "cases");
  const studies = await getCaseStudies(locale);
  return doc([
    ...intro(locale, "/realisations", t("hero.title")),
    t("hero.subtitle"),
    caseList(locale, studies),
    ...siteCtaBlocks(locale, t),
  ]);
}

async function caseStudy(
  locale: Locale,
  params: Params,
): Promise<string | null> {
  const cases = await getCaseStudies(locale);
  const meta = cases.find((c) => c.slug === params.slug);
  if (!meta) return null;
  const t = getStaticTranslator(locale, "cases");
  const following = followingItems(cases, meta.slug, 3);

  return doc([
    ...intro(locale, "/realisations/[slug]", meta.title, params),
    meta.summary,
    list([
      labelled(locale, t("labels.client"), meta.client),
      labelled(locale, t("labels.year"), String(meta.year)),
      labelled(locale, t("labels.stack"), meta.stack.join(", ")),
      labelled(locale, t("labels.outcome"), t("labels.noOutcome")),
      ...(meta.status
        ? [labelled(locale, t("labels.status"), t(`status.${meta.status}`))]
        : []),
    ]),
    meta.live !== false && link(t("labels.visit"), meta.url),
    await getMdxBody("realisations", meta.slug, locale),
    meta.flow && `## ${meta.flow.title}`,
    meta.flow?.caption,
    meta.flow && list(meta.flow.steps.map((step) => step.caption)),
    following.length > 0 && `## ${t("labels.next")}`,
    following.length > 0 && caseList(locale, following),
    following.length > 0 &&
      link(t("labels.all"), absoluteUrl(locale, "/realisations")),
    ...siteCtaBlocks(locale, t),
  ]);
}

async function about(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "about");
  const team = getStaticTranslator(locale, "home.team");
  const prices = getPriceValues(locale);
  const projects = selectHomeCases(await getCaseStudies(locale)).length;
  const citeme = (await getCaseStudies(locale)).find(
    (study) => study.slug === "citeme",
  );
  const contributions = getGithubContributions();
  const sisterText: Partial<
    Record<(typeof site.sisterSites)[number]["name"], string>
  > = {
    "Klyx Estate": t("products.estate"),
  };

  return doc([
    ...intro(locale, "/a-propos", t("hero.title")),
    t("hero.subtitle"),
    list([
      link(t("hero.ctaPrimary"), actionUrl(locale, "book")),
      link(t("hero.ctaSecondary"), absoluteUrl(locale, "/realisations")),
    ]),
    `**${team("name")}**, ${team("role")}`,
    team("bio"),
    list([
      ...(contributions
        ? [
            `${new Intl.NumberFormat(locale).format(contributions.total)} ${team("stats.contributions")}`,
          ]
        : []),
      `${projects} ${team("stats.projects")}`,
      `1 ${team("stats.contact")}`,
    ]),
    list([
      link(team("links.github"), site.socials.github),
      link(team("links.linkedin"), site.socials.linkedinFounder),
    ]),
    `## ${t("team.title")}`,
    t("team.intro"),
    list(
      ABOUT_TEAM.map((key) =>
        labelled(
          locale,
          `**${t(`team.items.${key}.title`)}**`,
          t(`team.items.${key}.body`),
        ),
      ),
    ),
    `## ${t("story.title")}`,
    t("story.intro"),
    t("story.body"),
    list(
      ABOUT_FACTS.map((key) =>
        labelled(
          locale,
          t(`story.facts.${key}.label`),
          t(`story.facts.${key}.value`),
        ),
      ),
    ),
    citeme && `## ${t("products.title")}`,
    citeme && t("products.citeme"),
    citeme &&
      labelled(
        locale,
        link(
          citeme.name,
          absoluteUrl(locale, "/realisations/[slug]", { slug: citeme.slug }),
        ),
        `${citeme.kind}. ${citeme.summary}`,
      ),
    `### ${t("products.lines")}`,
    list(
      site.sisterSites.map((sister) =>
        [
          link(sister.name, sister.url),
          sisterText[sister.name] && `: ${sisterText[sister.name]}`,
        ]
          .filter(Boolean)
          .join(""),
      ),
    ),
    `## ${t("trust.title")}`,
    t("trust.intro"),
    list(
      ABOUT_TRUST.map((key) =>
        labelled(
          locale,
          `**${t(`trust.items.${key}.title`)}**`,
          t(`trust.items.${key}.body`, prices),
        ),
      ),
    ),
    link(t("trust.pricing"), absoluteUrl(locale, "/tarifs")),
    ...siteCtaBlocks(locale, t),
  ]);
}

async function bordeaux(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "bordeaux");
  return doc([
    ...intro(locale, "/agence-ia-bordeaux", heroTitle(t)),
    t("hero.subtitle"),
    `## ${sectionTitle(t, "problem")}`,
    t("problem.body"),
    link(t("problem.source"), t("problem.sourceUrl")),
    `### ${t("examples.title")}`,
    list(messageStrings(t, "examples.items")),
    ...automationExampleBlocks(t),
    ...processBlocks(locale, t),
    `## ${sectionTitle(t, "local")}`,
    t("local.body"),
    list(
      ["city", "zone", "travel"].map((key) =>
        labelled(
          locale,
          t(`local.card.${key}.label`),
          t(`local.card.${key}.value`),
        ),
      ),
    ),
    `## ${sectionTitle(t, "trust")}`,
    t("trust.body"),
    ...faqBlocks(
      sectionTitle(t, "faq"),
      messageList(
        t,
        "faq.items",
        ["question", "answer"],
        getPriceValues(locale),
      ),
    ),
    ...ctaBlocks(locale, t, "cta", ["book", "quote"]),
  ]);
}

function workflowBlocks(locale: Locale, t: Translate, labels: Translate) {
  return [
    `## ${sectionTitle(t, "workflows")}`,
    t("workflows.body"),
    ...messageKeys(t.raw("workflows.examples")).flatMap((id) => [
      `### ${t(`workflows.examples.${id}.title`)}`,
      ["trigger", "ai", "human", "action"]
        .map((step) => t(`workflows.examples.${id}.steps.${step}`))
        .join(" → "),
      t(`workflows.examples.${id}.body`),
      labelled(locale, labels("tools"), t(`workflows.examples.${id}.tools`)),
    ]),
    t("workflows.limit"),
  ];
}

async function sectorPageMarkdown(
  locale: Locale,
  config: SectorPageConfig,
): Promise<string> {
  const t = getStaticTranslator(locale, config.namespace);
  const labels = getStaticTranslator(locale, "useCases.labels");
  const offersT = getStaticTranslator(locale, "offers");
  const prices = getPriceValues(locale);
  const tiers = config.offers.map((id) => getOfferCopy(offersT, locale, id));
  const proof = config.proof;
  const cases =
    proof.kind === "cases"
      ? (await getCaseStudies(locale)).filter((c) =>
          proof.slugs.includes(c.slug),
        )
      : [];
  const proofUrl = absoluteUrl(
    locale,
    proof.kind === "none" ? proof.href : "/realisations",
  );

  return doc([
    ...intro(locale, config.pathname, heroTitle(t)),
    getOfferCopy(offersT, locale, config.anchor).price,
    t("hero.subtitle", prices),
    `## ${sectionTitle(t, "problems")}`,
    t("problems.body"),
    list(messageStrings(t, "problems.items")),
    ...workflowBlocks(locale, t, labels),
    proof.kind === "none" &&
      `${t("proof.line")} ${link(t("proof.link"), proofUrl)}`,
    `## ${sectionTitle(t, "data")}`,
    t("data.body"),
    list(
      messageKeys(t.raw("data.rows")).map((row) =>
        labelled(
          locale,
          t(`data.rows.${row}.label`),
          t(`data.rows.${row}.value`),
        ),
      ),
    ),
    ...(config.terms
      ? [
          `## ${sectionTitle(t, "terms")}`,
          t("terms.body"),
          list(messageStrings(t, "terms.items")),
          ...processBlocks(locale, t),
        ]
      : []),
    ...(proof.kind === "cases"
      ? [
          `## ${sectionTitle(t, "proof")}`,
          t("proof.body"),
          link(t("proof.link"), proofUrl),
          caseList(locale, cases),
        ]
      : []),
    `## ${sectionTitle(t, "pricing")}`,
    t("pricing.body", prices),
    list(
      tiers.map((tier) =>
        labelled(
          locale,
          link(tier.name, absoluteUrl(locale, tier.href)),
          `${tier.price} · ${tier.duration}`,
        ),
      ),
    ),
    offersT("vatNote"),
    link(t("pricing.link"), absoluteUrl(locale, "/tarifs")),
    ...faqBlocks(
      sectionTitle(t, "faq"),
      messageList(t, "faq.items", ["question", "answer"], prices),
    ),
    ...ctaBlocks(locale, t, "cta", ["book", "quote"]),
  ]);
}

async function useCases(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "useCases");
  const nav = getStaticTranslator(locale, "nav");
  const offersT = getStaticTranslator(locale, "offers");
  return doc([
    ...intro(locale, "/cas-usage", heroTitle(t)),
    t("hero.subtitle", getPriceValues(locale)),
    `## ${sectionTitle(t, "sectors")}`,
    t("sectors.body"),
    ...SECTOR_KEYS.flatMap((key) => {
      const config = sectorPages[key];
      const anchor = getOfferCopy(offersT, locale, config.anchor);
      return [
        `### ${nav(key)}`,
        labelled(locale, t("labels.problem"), t(`${key}.card.problem`)),
        labelled(locale, t("labels.build"), t(`${key}.card.build`)),
        labelled(locale, t("labels.price"), `${anchor.price} · ${anchor.name}`),
        link(t("labels.see"), absoluteUrl(locale, config.pathname)),
      ];
    }),
    `## ${sectionTitle(t, "other")}`,
    t("other.body"),
    list([
      link(t("other.faq"), absoluteUrl(locale, "/faq")),
      link(t("other.pricing"), absoluteUrl(locale, "/tarifs")),
    ]),
    ...ctaBlocks(locale, t, "cta", ["book", "quote"]),
  ]);
}

async function faqPage(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "faqPage");
  const nav = getStaticTranslator(locale, "nav");
  const prices = getPriceValues(locale);
  const themes = faqThemes(getStaticTranslator(locale, ""), prices);
  return doc([
    ...intro(locale, "/faq", t("hero.title")),
    t("hero.subtitle", prices),
    list([
      link(t("hero.ctaPrimary"), actionUrl(locale, "book")),
      link(t("hero.ctaSecondary"), actionUrl(locale, "quote")),
    ]),
    ...themes.flatMap((theme) => [
      `## ${t(`themes.${theme.key}`)}`,
      ...theme.items.flatMap((item) => [
        `### ${item.question}`,
        item.answer,
        item.source &&
          link(
            t("source", { page: nav(item.source.navKey) }),
            absoluteUrl(locale, item.source.pathname),
          ),
      ]),
    ]),
    ...siteCtaBlocks(locale, t),
  ]);
}

async function contact(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "contact");
  const team = getStaticTranslator(locale, "home.team");
  return doc([
    ...intro(locale, "/contact", t("hero.title")),
    t("hero.subtitle"),
    `## ${t("booking.title")}`,
    `**${team("name")}**, ${t("booking.role")}`,
    t("booking.message"),
    [t("booking.video"), t("booking.free"), t("booking.noCommitment")].join(
      " · ",
    ),
    link(t("booking.title"), actionUrl(locale, "book")),
    t("booking.next"),
    `## ${t("form.title")}`,
    t("form.intro"),
    `<${absoluteUrl(locale, "/contact")}>`,
    `## ${t("direct.title")}`,
    list([
      labelled(
        locale,
        t("direct.email"),
        link(site.email, `mailto:${site.email}`),
      ),
      labelled(
        locale,
        t("direct.phone"),
        link(site.phone, `tel:${site.phoneE164}`),
      ),
      t("direct.location"),
    ]),
    `### ${t("direct.socials")}`,
    list(socialLinks.map((social) => link(social.name, social.href))),
  ]);
}

async function blog(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "blog");
  const posts = await getPostSummaries(locale);
  return doc([
    ...intro(locale, "/blog", t("hero.title")),
    t("hero.intro"),
    posts.length === 0
      ? t("empty")
      : list(
          posts.map((post) =>
            labelled(
              locale,
              `${link(post.title, absoluteUrl(locale, "/blog/[slug]", { slug: post.slug }))} (${formatDate(locale, post.date)}, ${t("readingTime", { minutes: post.minutes })})`,
              post.summary,
            ),
          ),
        ),
    link(t("rss"), `${site.url}/blog/rss.xml`),
  ]);
}

async function blogPost(
  locale: Locale,
  params: Params,
): Promise<string | null> {
  const meta = (await getPosts(locale)).find((p) => p.slug === params.slug);
  if (!meta) return null;
  const t = getStaticTranslator(locale, "blog");
  const body = await getMdxBody("blog", meta.slug, locale);
  const sources = meta.sources ?? [];
  const services = postServices(meta.slug);
  return doc([
    ...intro(locale, "/blog/[slug]", meta.title, params),
    meta.summary,
    [
      t("byline", { author: site.founder }),
      t("published", { date: formatDate(locale, meta.date) }),
      meta.updated && t("updated", { date: formatDate(locale, meta.updated) }),
      t("readingTime", { minutes: readingMinutes(body) }),
    ]
      .filter(Boolean)
      .join(" · "),
    body,
    sources.length > 0 && `## ${t("sources.title")}`,
    sources.length > 0 &&
      sources
        .map((source, i) => `${i + 1}. ${link(source.title, source.url)}`)
        .join("\n"),
    services.length > 0 && `## ${t("services.title")}`,
    services.length > 0 &&
      list(
        services.map(({ key, offer }) =>
          labelled(
            locale,
            link(t(`services.names.${key}`), absoluteUrl(locale, offer.page)),
            t("services.price", {
              price: formatPrice(getOfferPrice(offer.id), locale),
              unit: offer.unit,
            }),
          ),
        ),
      ),
  ]);
}

async function legal(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "legal");
  return doc([
    ...intro(locale, "/mentions-legales", t("title")),
    t("updated", { date: formatDate(locale, site.legalUpdatedAt) }),
    `## ${t("publisher.title")}`,
    t("publisher.body"),
    t("publisher.siret", { siret: site.siret }),
    t("publisher.email", { email: site.email }),
    t("publisher.phone", { phone: site.phone }),
    t("publisher.director"),
    `## ${t("hosting.title")}`,
    t("hosting.body"),
    `## ${t("ip.title")}`,
    t("ip.body"),
    `## ${t("credits.title")}`,
    t("credits.trademarks"),
    list(
      CREDITS.map((credit) =>
        [
          t(`credits.items.${credit.key}`),
          link(t("credits.source"), credit.source),
          credit.license && link(t("credits.license"), credit.license),
        ]
          .filter(Boolean)
          .join(" "),
      ),
    ),
    `## ${t("data.title")}`,
    t("data.body"),
    link(t("data.link"), absoluteUrl(locale, "/confidentialite")),
  ]);
}

const PRIVACY_SECTIONS = [
  { key: "contactForm", paragraphs: ["body"] },
  { key: "booking", paragraphs: ["body"] },
  {
    key: "analytics",
    paragraphs: ["body", "purpose", "retention", "optOut", "cookies"],
  },
  { key: "hosting", paragraphs: ["body"] },
] as const;
const PROSPECTION_PARAGRAPHS = [
  "intro",
  "legalBasis",
  "sources",
  "retention",
  "optOut",
] as const;

async function privacy(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "privacy");
  const values = { email: site.email };
  return doc([
    ...intro(locale, "/confidentialite", t("title")),
    t("updated", { date: formatDate(locale, site.legalUpdatedAt) }),
    t("intro", values),
    ...PRIVACY_SECTIONS.flatMap(({ key, paragraphs }) => [
      `## ${t(`${key}.title`)}`,
      ...paragraphs.map((paragraph) => t(`${key}.${paragraph}`, values)),
    ]),
    `## ${t("prospection.title")}`,
    ...PROSPECTION_PARAGRAPHS.map((key) => t(`prospection.${key}`, values)),
    `## ${t("rights.title")}`,
    t("rights.body", values),
  ]);
}

const BUILDERS = {
  "/": home,
  "/services/creation-site-web": (locale) =>
    offerPageMarkdown(locale, offerPages.sites),
  "/services/agents-ia": (locale) =>
    offerPageMarkdown(locale, offerPages.agents),
  "/services/audit-ia": (locale) => offerPageMarkdown(locale, offerPages.audit),
  "/services/automatisation-ia": (locale) =>
    offerPageMarkdown(locale, offerPages.automation),
  "/services/geo-referencement-ia": (locale) =>
    offerPageMarkdown(locale, offerPages.geo),
  "/forward-deployed-engineer": (locale) =>
    offerPageMarkdown(locale, offerPages.fde),
  "/tarifs": pricing,
  "/realisations": cases,
  "/realisations/[slug]": caseStudy,
  "/a-propos": about,
  "/agence-ia-bordeaux": bordeaux,
  "/cas-usage": useCases,
  "/cas-usage/immobilier": (locale) =>
    sectorPageMarkdown(locale, sectorPages.realEstate),
  "/cas-usage/agences": (locale) =>
    sectorPageMarkdown(locale, sectorPages.agencies),
  "/cas-usage/cabinets-services": (locale) =>
    sectorPageMarkdown(locale, sectorPages.services),
  "/faq": faqPage,
  "/contact": contact,
  "/blog": blog,
  "/blog/[slug]": blogPost,
  "/mentions-legales": legal,
  "/confidentialite": privacy,
} satisfies Record<AppPathname, Builder>;

export async function pageMarkdown(
  locale: Locale,
  page: MachinePage,
): Promise<string | null> {
  const build: Builder = BUILDERS[page.pathname];
  return build(locale, page.params ?? {});
}

function localizedTemplate(locale: Locale, pathname: AppPathname): string {
  const value = routing.pathnames[pathname];
  return typeof value === "string" ? value : value[locale];
}

export function resolveMachinePage(
  locale: Locale,
  segments: string[],
): MachinePage | null {
  for (const pathname of Object.keys(routing.pathnames) as AppPathname[]) {
    const template = localizedTemplate(locale, pathname)
      .split("/")
      .filter(Boolean);
    if (template.length !== segments.length) continue;
    const params: Params = {};
    const matches = template.every((part, i) => {
      const dynamic = /^\[(\w+)\]$/.exec(part);
      if (!dynamic) return part === segments[i];
      params[dynamic[1]] = segments[i];
      return true;
    });
    if (matches) return { pathname, params };
  }
  return null;
}

export async function machinePages(locale: Locale): Promise<MachinePage[]> {
  const pathnames = Object.keys(routing.pathnames) as AppPathname[];
  const staticPages = pathnames
    .filter((pathname) => !pathname.includes("["))
    .map((pathname) => ({ pathname }));
  const caseStudies = await getCaseStudies(locale);
  const posts = await getPosts(locale);
  return [
    ...staticPages,
    ...caseStudies.map((c) => ({
      pathname: "/realisations/[slug]" as const,
      params: { slug: c.slug },
    })),
    ...posts.map((p) => ({
      pathname: "/blog/[slug]" as const,
      params: { slug: p.slug },
    })),
  ];
}
