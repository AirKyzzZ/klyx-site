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
  HOME_OFFER_CARDS,
  selectHomeCases,
} from "@/lib/home-sections";
import { getOfferCopy } from "@/lib/offer-copy";
import { type OfferPageConfig, offerPages } from "@/lib/offer-pages";
import {
  formatPrice,
  getOfferPrice,
  getPriceValues,
  MARKET_KLYX_OFFER,
  type OfferId,
  PRICE_GROUPS,
} from "@/lib/offers";
import { type AppPathname, absoluteUrl } from "@/lib/seo";
import { getSiteShot } from "@/lib/proof";
import { scenarios } from "@/lib/scenarios";
import { site, socialLinks } from "@/lib/site";
import { type TeamRoster, teamRoster } from "@/lib/team-roster";

import type { MachinePage } from "./markdown-href";

export type { MachinePage } from "./markdown-href";

type Params = Record<string, string>;
type Builder = (locale: Locale, params: Params) => Promise<string | null>;
type Block = string | null | undefined | false;
type Action = "book" | "quote";
type Faq = { question: string; answer: string };

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

function formatDate(locale: Locale, date: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(date));
}

async function home(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "home");
  const casesT = getStaticTranslator(locale, "cases");
  const prices = getPriceValues(locale);
  const price = (id: OfferId) => formatPrice(getOfferPrice(id), locale);
  const cases = selectHomeCases(await getCaseStudies(locale));

  return doc([
    ...intro(locale, "/", heroTitle(t)),
    t("hero.subtitle"),
    list([
      t("fold.repo"),
      t("fold.prices"),
      t("fold.base"),
    ]),
    `## ${sectionTitle(t, "offers")}`,
    t("offers.subtitle"),
    ...HOME_OFFER_CARDS.flatMap((card) => [
      `### ${t(`offers.cards.${card.key}.name`)}`,
      `${t(`offers.cards.${card.key}.price`, { price: price(card.offer) })} · ${t(`offers.cards.${card.key}.duration`)}`,
      t(`offers.cards.${card.key}.outcome`),
      link(t("offers.link"), absoluteUrl(locale, card.href)),
    ]),
    labelled(
      locale,
      t("offers.also.label"),
      ALSO_OFFERS.map(({ key, href }) =>
        link(t(`offers.also.${key}`), absoluteUrl(locale, href)),
      ).join(" · "),
    ),
    cases.length > 0 && `## ${heroTitle(casesT)}`,
    cases.length > 0 && t("cases.subtitle"),
    caseList(locale, cases),
    ...processBlocks(locale, t),
    `## ${sectionTitle(t, "founder")}`,
    t("founder.body"),
    rosterList(locale, teamRoster(t, "founder.roster")),
    t("founder.experience"),
    list([
      link(t("founder.github"), site.socials.github),
      link(t("founder.linkedin"), site.socials.linkedinFounder),
      link(t("founder.about"), absoluteUrl(locale, "/a-propos")),
    ]),
    ...faqBlocks(
      sectionTitle(t, "faq"),
      messageList(t, "faq.items", ["question", "answer"], prices),
    ),
    ...ctaBlocks(locale, t, "finalCta", ["book", "quote"]),
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
      return [`## ${sectionTitle(t, "block")}`, t("block.body")];
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
        t("block.bpifrance.source"),
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
  const proofUrl =
    config.proofLink === "github"
      ? site.socials.github
      : absoluteUrl(locale, "/realisations");
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
    getOfferCopy(offersT, locale, config.anchor).price,
    t("hero.subtitle", prices),
    `## ${sectionTitle(t, "problem")}`,
    t("problem.body"),
    list(messageStrings(t, "problem.symptoms")),
    `## ${sectionTitle(t, "deliverables")}`,
    hasChild(t, "deliverables", "subtitle") && t("deliverables.subtitle"),
    ...deliverables,
    offersT("vatNote"),
    ...processBlocks(locale, t),
    ...blockMarkdown(locale, config, t),
    ...(config.proofLink === null
      ? []
      : [
          `## ${sectionTitle(t, "proof")}`,
          t("proof.body"),
          link(t("proof.link"), proofUrl),
          caseList(locale, cases),
        ]),
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
    link(t("pricing.link"), absoluteUrl(locale, "/tarifs")),
    ...faqBlocks(
      sectionTitle(t, "faq"),
      messageList(t, "faq.items", ["question", "answer"], prices),
    ),
    ...ctaBlocks(locale, t, "cta", config.cta),
  ]);
}

function marketTable(locale: Locale, t: Translate, offersT: Translate) {
  const columns = ["item", "market", "klyx", "source"].map((column) =>
    t(`market.card.columns.${column}`),
  );
  return [
    `| ${columns.join(" | ")} |`,
    `| ${columns.map(() => "---").join(" | ")} |`,
    ...messageKeys(t.raw("market.card.rows")).map((key) => {
      const row = `market.card.rows.${key}`;
      const source = hasChild(t, row, "url")
        ? link(t(`${row}.source`), t(`${row}.url`))
        : t(`${row}.source`);
      const klyx = getOfferCopy(offersT, locale, MARKET_KLYX_OFFER[key]).price;
      return `| ${[t(`${row}.label`), t(`${row}.range`), klyx, source].map(cell).join(" | ")} |`;
    }),
  ].join("\n");
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
    `## ${t("market.title")}`,
    t("market.body"),
    marketTable(locale, t, offersT),
    t("market.card.note"),
    ...faqBlocks(
      t("faq.title"),
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
    ]),
    link(t("labels.visit"), meta.url),
    await getMdxBody("realisations", meta.slug, locale),
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
  const sisterText = {
    "Klyx Studio": t("lines.studio"),
    "Klyx Estate": t("lines.estate"),
  };
  const citeme = getSiteShot("citeme");

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
    t("story.citeme"),
    list([
      link(founder("github"), site.socials.github),
      link(founder("linkedin"), site.socials.linkedinFounder),
    ]),
    citeme && `## ${founder("products")}`,
    citeme && link("CiteMe", citeme.url),
    `## ${t("lines.title")}`,
    list(
      site.sisterSites.map(
        (sister) =>
          `${sisterText[sister.name]} ${link(new URL(sister.url).host, sister.url)}`,
      ),
    ),
    `## ${sectionTitle(t, "trust")}`,
    t("trust.body"),
    list(trust.map((item) => labelled(locale, item.label, item.value))),
    ...ctaBlocks(locale, t, "cta", ["book", "quote"]),
  ]);
}

async function bordeaux(locale: Locale): Promise<string> {
  const t = getStaticTranslator(locale, "bordeaux");
  const automation = getStaticTranslator(locale, "automation");
  return doc([
    ...intro(locale, "/agence-ia-bordeaux", heroTitle(t)),
    t("hero.subtitle"),
    `## ${t("problem.title")}`,
    t("problem.body"),
    `### ${t("examples.title")}`,
    list(messageStrings(t, "examples.items")),
    ...automationExampleBlocks(automation),
    ...processBlocks(locale, t),
    `## ${t("local.title")}`,
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
    `## ${t("trust.title")}`,
    t("trust.body"),
    ...faqBlocks(
      t("faq.title"),
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
    list([link(site.email, `mailto:${site.email}`), t("direct.location")]),
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
    t("publisher.vat"),
    t("publisher.email", { email: site.email }),
    t("publisher.director"),
    `## ${t("hosting.title")}`,
    t("hosting.body"),
    `## ${t("ip.title")}`,
    t("ip.body"),
    `## ${t("data.title")}`,
    t("data.body"),
    link(t("data.link"), absoluteUrl(locale, "/confidentialite")),
  ]);
}

const PRIVACY_SECTIONS = [
  "contactForm",
  "booking",
  "analytics",
  "hosting",
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
    ...PRIVACY_SECTIONS.flatMap((key) => [
      `## ${t(`${key}.title`)}`,
      t(`${key}.body`),
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
