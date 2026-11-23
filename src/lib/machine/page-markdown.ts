import {
  messageKeys,
  messageList,
  messageStrings,
  type Translate,
} from "@/i18n/message-list";
import { type Locale, routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { caseYears, getCaseStudies, getMdxBody, getPosts } from "@/lib/content";
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
  type OfferId,
  PRICE_GROUPS,
} from "@/lib/offers";
import { type AppPathname, absoluteUrl } from "@/lib/seo";
import { CREDITS } from "@/lib/credits";
import {
  getGithubContributions,
  getSiteShot,
  getVerifiedProof,
} from "@/lib/proof";
import { faqThemes } from "@/lib/faq-page";
import { scenarios } from "@/lib/scenarios";
import {
  BORDEAUX_BLOG_PILLAR,
  BORDEAUX_EXAMPLES,
  BORDEAUX_OFFERS,
  BORDEAUX_PLACES,
  LOCAL_CASES,
} from "@/lib/bordeaux-page";
import {
  COMMON_TASKS,
  SECTOR_KEYS,
  type SectorPageConfig,
  type SectorWorkflow,
  sectorPages,
} from "@/lib/sector-pages";
import { site, socialLinks } from "@/lib/site";
import { type TeamRoster, teamRoster } from "@/lib/team-roster";
import { DEPLOYED_TECH, type ToolGroup } from "@/lib/tools";

import type { MachinePage } from "./markdown-href";

export type { MachinePage } from "./markdown-href";

type Params = Record<string, string>;
type Builder = (locale: Locale, params: Params) => Promise<string | null>;
type Block = string | null | undefined | false;
type Action = "book" | "quote";
type Faq = { question: string; answer: string };

const METHOD_STEPS = ["call", "quote", "build", "handover"] as const;

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

function rosterList(locale: Locale, roster: TeamRoster): string {
  return list(
    roster.items.map((item) =>
      labelled(locale, `**${item.role}**`, `${item.who} · ${item.scope}`),
    ),
  );
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
    ...intro(locale, "/realisations", heroTitle(t)),
    t("hero.subtitle"),
    t("count", { count: studies.length, years: caseYears(studies) }),
    caseList(locale, studies),
    ...ctaBlocks(locale, t, "cta", ["book", "quote"]),
  ]);
}

async function caseStudy(
  locale: Locale,
  params: Params,
): Promise<string | null> {
  const meta = (await getCaseStudies(locale)).find(
    (c) => c.slug === params.slug,
  );
  if (!meta) return null;
  const t = getStaticTranslator(locale, "cases");

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
    meta.flow && list(meta.flow.steps.map((step) => step.caption)),
    meta.flow?.caption,
    ...ctaBlocks(locale, t, "cta", ["book", "quote"]),
  ]);
}

async function about(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "about");
  const founder = getStaticTranslator(locale, "home.founder");
  const facts = messageList(t, "facts.items", ["label", "value"]);
  const trust = messageList(t, "trust.items", ["label", "value"], {
    github: site.socials.github.replace("https://", ""),
  });
  const sisterText: Partial<
    Record<(typeof site.sisterSites)[number]["name"], string>
  > = {
    "Klyx Estate": t("lines.estate"),
  };
  const citeme = getSiteShot("citeme");
  const contributions = getGithubContributions();

  return doc([
    ...intro(locale, "/a-propos", heroTitle(t)),
    t("hero.subtitle"),
    list(facts.map((fact) => labelled(locale, fact.label, fact.value))),
    `## ${sectionTitle(t, "team")}`,
    rosterList(locale, teamRoster(founder, "roster")),
    t("team.intro"),
    t("team.agents"),
    t("team.partners"),
    t("team.handover"),
    `## ${sectionTitle(t, "story")}`,
    t("story.intro"),
    t("story.work"),
    list([
      link(founder("github"), site.socials.github),
      link(founder("linkedin"), site.socials.linkedinFounder),
    ]),
    contributions &&
      `${t("contributions.total", { total: new Intl.NumberFormat(locale).format(contributions.total) })}. ${t("contributions.caption", { date: formatDate(locale, contributions.capturedAt) })}`,
    citeme && `## ${sectionTitle(t, "products")}`,
    citeme && link("CiteMe", citeme.url),
    citeme && t("story.citeme"),
    `## ${t("lines.title")}`,
    list(
      site.sisterSites.map((sister) =>
        [sisterText[sister.name], link(new URL(sister.url).host, sister.url)]
          .filter(Boolean)
          .join(" "),
      ),
    ),
    `## ${sectionTitle(t, "trust")}`,
    t("trust.body"),
    list(trust.map((item) => labelled(locale, item.label, item.value))),
    ...ctaBlocks(locale, t, "cta", ["book", "quote"]),
  ]);
}

function comparisonBlocks(
  locale: Locale,
  t: Translate,
  path: string,
  labels: [string, string],
): Block[] {
  return messageKeys(t.raw(path)).flatMap((key) => [
    `### ${t(`${path}.${key}.title`)}`,
    list([
      labelled(locale, labels[0], t(`${path}.${key}.before`)),
      labelled(locale, labels[1], t(`${path}.${key}.after`)),
    ]),
  ]);
}

function taskBlocks(
  locale: Locale,
  t: Translate,
  path: string,
  tasks: SectorWorkflow[],
  labels: { agent: string; builder?: string; team: string },
): Block[] {
  return tasks.flatMap(({ id, builtByUs }) => [
    `### ${t(`${path}.${id}.title`)} (${t(`${path}.${id}.category`)})`,
    list([
      labelled(
        locale,
        builtByUs && labels.builder ? labels.builder : labels.agent,
        t(`${path}.${id}.agent`),
      ),
      labelled(locale, labels.team, t(`${path}.${id}.team`)),
    ]),
  ]);
}

function priceCardBlocks(
  locale: Locale,
  t: Translate,
  ids: readonly OfferId[],
): Block {
  const offersT = getStaticTranslator(locale, "offers");
  return list(
    ids.map((id) => {
      const tier = getOfferCopy(offersT, locale, id);
      return labelled(
        locale,
        link(tier.name, absoluteUrl(locale, tier.href)),
        `${tier.price} · ${tier.duration}. ${t(`pricing.cards.${id}.audience`)} ${t(`pricing.cards.${id}.body`)}`,
      );
    }),
  );
}

function methodBlocks(locale: Locale, t: Translate, path: string): Block[] {
  const steps = messageList(t, `${path}.steps`, ["when", "title", "body"]);
  return [
    `## ${t(`${path}.title`)}`,
    t(`${path}.intro`),
    steps
      .map(
        (step, i) =>
          `${i + 1}. ${labelled(locale, `**${step.title}**`, `${step.body} (${step.when})`)}`,
      )
      .join("\n"),
  ];
}

function bookBlocks(
  locale: Locale,
  t: Translate,
  labels: { book: string; quote: string },
): Block[] {
  return [
    `## ${t("cta.title")}`,
    t("cta.body"),
    list([
      link(labels.book, actionUrl(locale, "book")),
      link(labels.quote, actionUrl(locale, "quote")),
    ]),
  ];
}

function caseRowList(
  locale: Locale,
  cases: CaseStudyMeta[],
  kind: (study: CaseStudyMeta) => string,
): Block {
  if (cases.length === 0) return null;
  return list(
    cases.map((c) =>
      labelled(
        locale,
        link(
          c.title,
          absoluteUrl(locale, "/realisations/[slug]", { slug: c.slug }),
        ),
        `${kind(c)} · ${c.year}. ${c.summary}`,
      ),
    ),
  );
}

async function bordeaux(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "bordeaux");
  const prices = getPriceValues(locale);
  const studies = await getCaseStudies(locale);
  const cases = LOCAL_CASES.flatMap((slug) => {
    const study = studies.find((c) => c.slug === slug);
    return study ? [study] : [];
  });
  const offersT = getStaticTranslator(locale, "offers");
  const audit = getOfferCopy(offersT, locale, "audit-ia");
  return doc([
    ...intro(locale, "/agence-ia-bordeaux", t("hero.title")),
    t("hero.subtitle"),
    list([
      labelled(locale, t("labels.audience"), t("hero.audience")),
      labelled(locale, t("labels.zone"), t("hero.zone")),
      labelled(locale, audit.name, `${audit.price} · ${audit.duration}`),
    ]),
    `## ${t("problem.title")}`,
    t("problem.intro"),
    link(t("problem.source"), t("problem.sourceUrl")),
    ...comparisonBlocks(locale, t, "problem.items", [
      t("labels.before"),
      t("labels.after"),
    ]),
    `## ${t("examples.title")}`,
    t("examples.intro"),
    ...taskBlocks(locale, t, "examples.items", BORDEAUX_EXAMPLES, {
      agent: t("labels.agent"),
      team: t("labels.team"),
    }),
    link(t("examples.link"), absoluteUrl(locale, "/cas-usage")),
    `## ${t("consultant.title")}`,
    t("consultant.intro"),
    list(
      ["audit", "person", "owned"].map((key) =>
        labelled(
          locale,
          `**${t(`consultant.items.${key}.title`)}**`,
          t(`consultant.items.${key}.body`, prices),
        ),
      ),
    ),
    `${t("consultant.blogLead")} ${link(
      t("consultant.blogLink"),
      absoluteUrl(locale, "/blog/[slug]", { slug: BORDEAUX_BLOG_PILLAR }),
    )}`,
    link(t("consultant.auditLink"), absoluteUrl(locale, "/services/audit-ia")),
    `## ${t("pricing.title")}`,
    t("pricing.intro"),
    priceCardBlocks(locale, t, BORDEAUX_OFFERS),
    offersT("vatNote"),
    link(t("labels.allPricing"), absoluteUrl(locale, "/tarifs")),
    ...methodBlocks(locale, t, "method"),
    `## ${t("zone.title")}`,
    t("zone.intro"),
    list(
      BORDEAUX_PLACES.map((key) =>
        labelled(
          locale,
          t(`zone.places.${key}.name`),
          t(`zone.places.${key}.note`),
        ),
      ),
    ),
    `## ${t("local.title")}`,
    t("local.intro"),
    caseRowList(locale, cases, (c) => t(`local.cases.${c.slug}`)),
    ...faqBlocks(
      t("faq.title"),
      messageList(t, "faq.items", ["question", "answer"], prices),
    ),
    ...bookBlocks(locale, t, {
      book: t("labels.book"),
      quote: t("labels.quote"),
    }),
  ]);
}

async function sectorPageMarkdown(
  locale: Locale,
  config: SectorPageConfig,
): Promise<string> {
  const t = getStaticTranslator(locale, config.namespace);
  const labels = getStaticTranslator(locale, "useCases.labels");
  const offersT = getStaticTranslator(locale, "offers");
  const prices = getPriceValues(locale);
  const anchor = getOfferCopy(offersT, locale, config.anchor);
  const proof = config.proof;
  const studies = await getCaseStudies(locale);
  const cases =
    proof.kind === "cases"
      ? proof.slugs.flatMap((slug) => {
          const study = studies.find((c) => c.slug === slug);
          return study ? [study] : [];
        })
      : [];
  const methodPath = config.ownMethod ? "method" : null;
  const sharedMethod = getStaticTranslator(locale, "useCases");

  return doc([
    ...intro(locale, config.pathname, t("hero.title")),
    t("hero.subtitle", prices),
    list([
      labelled(locale, labels("audience"), t("hero.audience")),
      labelled(locale, labels("offer"), t("hero.offer")),
      labelled(locale, anchor.name, `${anchor.price} · ${anchor.duration}`),
    ]),
    `## ${t("problems.title")}`,
    t("problems.intro"),
    ...comparisonBlocks(locale, t, "problems.items", [
      labels("before"),
      labels("after"),
    ]),
    `## ${t("workflows.title")}`,
    t("workflows.intro"),
    ...taskBlocks(locale, t, "workflows.items", config.workflows, {
      agent: labels("agent"),
      builder: labels("builder"),
      team: labels("team"),
    }),
    proof.kind === "none" &&
      `${t("workflows.note")} ${link(t("workflows.noteLink"), absoluteUrl(locale, proof.href))}`,
    ...(config.terms
      ? [
          `## ${t("terms.title")}`,
          t("terms.intro"),
          list(
            messageKeys(t.raw("terms.items")).map((key) =>
              labelled(
                locale,
                `**${t(`terms.items.${key}.title`)}**`,
                t(`terms.items.${key}.body`),
              ),
            ),
          ),
        ]
      : []),
    ...(cases.length > 0
      ? [
          `## ${t("proof.title")}`,
          t("proof.intro"),
          caseRowList(locale, cases, (c) => c.client),
          link(labels("allCases"), absoluteUrl(locale, "/realisations")),
        ]
      : []),
    `## ${t("pricing.title")}`,
    t("pricing.intro", prices),
    priceCardBlocks(locale, t, config.offers),
    t("pricing.note", prices),
    offersT("vatNote"),
    link(labels("allPricing"), absoluteUrl(locale, "/tarifs")),
    ...(methodPath
      ? methodBlocks(locale, t, methodPath)
      : methodBlocks(locale, sharedMethod, "method")),
    `## ${t("data.title")}`,
    t("data.intro"),
    list(
      messageKeys(t.raw("data.items")).map((key) =>
        labelled(
          locale,
          `**${t(`data.items.${key}.title`)}**`,
          t(`data.items.${key}.body`),
        ),
      ),
    ),
    labelled(
      locale,
      labels("tools"),
      config.tools.map((tool) => tool.name).join(", "),
    ),
    ...faqBlocks(
      t("faq.title"),
      messageList(t, "faq.items", ["question", "answer"], prices),
    ),
    ...bookBlocks(locale, t, { book: labels("book"), quote: labels("quote") }),
  ]);
}

async function useCases(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "useCases");
  const nav = getStaticTranslator(locale, "nav");
  const offersT = getStaticTranslator(locale, "offers");
  return doc([
    ...intro(locale, "/cas-usage", t("hero.title")),
    t("hero.subtitle", getPriceValues(locale)),
    `## ${t("sectors.title")}`,
    t("sectors.intro"),
    ...SECTOR_KEYS.flatMap((key) => {
      const config = sectorPages[key];
      const anchor = getOfferCopy(offersT, locale, config.anchor);
      return [
        `### ${nav(key)}`,
        t(`${key}.card.problem`),
        t(`${key}.card.build`),
        labelled(locale, anchor.name, anchor.price),
        link(t("labels.see"), absoluteUrl(locale, config.pathname)),
      ];
    }),
    `## ${t("common.title")}`,
    t("common.intro"),
    ...COMMON_TASKS.flatMap(({ id }) => [
      `### ${t(`common.items.${id}.title`)} (${t(`common.items.${id}.category`)})`,
      list([
        labelled(locale, t("labels.before"), t(`common.items.${id}.before`)),
        labelled(locale, t("labels.after"), t(`common.items.${id}.after`)),
      ]),
    ]),
    list([
      link(t("common.faq"), absoluteUrl(locale, "/faq")),
      link(t("labels.allPricing"), absoluteUrl(locale, "/tarifs")),
    ]),
    ...bookBlocks(locale, t, {
      book: t("labels.book"),
      quote: t("labels.quote"),
    }),
  ]);
}

async function faqPage(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "faqPage");
  const nav = getStaticTranslator(locale, "nav");
  const themes = faqThemes(
    getStaticTranslator(locale, ""),
    getPriceValues(locale),
  );
  const count = themes.reduce((sum, theme) => sum + theme.items.length, 0);
  return doc([
    ...intro(locale, "/faq", heroTitle(t)),
    t("count", { count, themes: themes.length }),
    t("hero.subtitle", getPriceValues(locale)),
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
    ...ctaBlocks(locale, t, "cta", ["book", "quote"]),
  ]);
}

async function contact(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "contact");
  return doc([
    ...intro(locale, "/contact", heroTitle(t)),
    t("hero.subtitle"),
    `## ${t("booking.title")}`,
    `${t("booking.duration")} · ${t("booking.body")}`,
    t("booking.next"),
    link(t("booking.title"), actionUrl(locale, "book")),
    `## ${t("direct.title")}`,
    list([
      link(site.email, `mailto:${site.email}`),
      link(site.phone, `tel:${site.phoneE164}`),
      t("direct.location"),
    ]),
    `## ${site.name}`,
    list(socialLinks.map((social) => link(social.name, social.href))),
    `## ${t("form.title")}`,
    `<${absoluteUrl(locale, "/contact")}>`,
  ]);
}

async function blog(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "blog");
  const posts = await getPosts(locale);
  return doc([
    ...intro(locale, "/blog", t("hero.title")),
    t("hero.subtitle"),
    posts.length === 0
      ? `${t("emptyCount")}. ${t("empty")}`
      : list(
          posts.map((post) =>
            labelled(
              locale,
              `${link(post.title, absoluteUrl(locale, "/blog/[slug]", { slug: post.slug }))} (${formatDate(locale, post.date)})`,
              post.summary,
            ),
          ),
        ),
  ]);
}

async function blogPost(
  locale: Locale,
  params: Params,
): Promise<string | null> {
  const meta = (await getPosts(locale)).find((p) => p.slug === params.slug);
  if (!meta) return null;
  const t = getStaticTranslator(locale, "blog");
  return doc([
    ...intro(locale, "/blog/[slug]", meta.title, params),
    `${t("byline", { author: site.founder })} · ${t("published", { date: formatDate(locale, meta.date) })}`,
    await getMdxBody("blog", meta.slug, locale),
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
