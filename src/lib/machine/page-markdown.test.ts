import { describe, expect, it } from "vitest";

import { messageList } from "@/i18n/message-list";
import { type Locale, routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { getCaseStudies, getPosts } from "@/lib/content";
import {
  FDE_MIN_DAYS_PER_WEEK,
  FDE_MIN_WEEKS,
  formatPrice,
  getOfferPrice,
  getPriceValues,
  type OfferId,
} from "@/lib/offers";
import type { AppPathname } from "@/lib/seo";
import { faqPageItems } from "@/lib/faq-page";
import {
  HOME_FAQ,
  HOME_GUIDES,
  HOME_TOOLS,
  selectHomeGuides,
} from "@/lib/home-sections";
import { getGithubContributions } from "@/lib/proof";
import { DEPLOYED_TECH, type ToolGroup } from "@/lib/tools";

import {
  internalPathname,
  markdownHref,
  pageMarkdownHref,
} from "./markdown-href";
import {
  type MachinePage,
  machinePages,
  pageMarkdown,
  resolveMachinePage,
} from "./page-markdown";

type Expectation = {
  h1: (locale: Locale, page: MachinePage) => Promise<string> | string;
  prices?: OfferId[];
  fdeMinimum?: boolean;
  faqNamespace?: string;
  faqKeys?: readonly string[];
};

const plainTitle = (namespace: string, key: string) => (locale: Locale) =>
  getStaticTranslator(locale, namespace)(key);

const EXPECTATIONS: Record<AppPathname, Expectation> = {
  "/": {
    h1: plainTitle("home", "hero.title"),
    prices: ["landing", "audit-ia", "sprint-ia", "fde"],
    faqNamespace: "home",
    faqKeys: HOME_FAQ,
  },
  "/services/creation-site-web": {
    h1: plainTitle("sites", "hero.title"),
    prices: ["landing", "site-ia", "site-custom"],
    faqNamespace: "sites",
  },
  "/services/agents-ia": {
    h1: plainTitle("agents", "hero.title"),
    prices: ["audit-ia", "sprint-ia"],
    faqNamespace: "agents",
  },
  "/services/audit-ia": {
    h1: plainTitle("audit", "hero.title"),
    prices: ["audit-ia", "automation", "sprint-ia"],
    faqNamespace: "audit",
  },
  "/services/automatisation-ia": {
    h1: plainTitle("automation", "hero.title"),
    prices: ["automation", "automation-care", "sprint-ia"],
    faqNamespace: "automation",
  },
  "/services/geo-referencement-ia": {
    h1: plainTitle("geo", "hero.title"),
    prices: ["geo", "geo-care", "site-ia"],
    faqNamespace: "geo",
  },
  "/forward-deployed-engineer": {
    h1: plainTitle("fde", "hero.title"),
    prices: ["fde"],
    fdeMinimum: true,
    faqNamespace: "fde",
  },
  "/tarifs": {
    h1: plainTitle("pricing", "hero.title"),
    prices: [
      "landing",
      "site-ia",
      "site-custom",
      "geo",
      "geo-care",
      "audit-ia",
      "automation",
      "automation-care",
      "sprint-ia",
      "fde",
    ],
    faqNamespace: "pricing",
  },
  "/realisations": { h1: plainTitle("cases", "hero.title") },
  "/realisations/[slug]": {
    h1: async (locale, page) => {
      const cases = await getCaseStudies(locale);
      const study = cases.find((c) => c.slug === page.params?.slug);
      if (!study) throw new Error(`No case study ${page.params?.slug}`);
      return study.title;
    },
  },
  "/a-propos": {
    h1: plainTitle("about", "hero.title"),
    prices: ["landing", "audit-ia", "sprint-ia"],
  },
  "/agence-ia-bordeaux": {
    h1: plainTitle("bordeaux", "hero.title"),
    prices: ["audit-ia", "automation", "sprint-ia"],
    faqNamespace: "bordeaux",
  },
  "/cas-usage": {
    h1: plainTitle("useCases", "hero.title"),
    prices: ["audit-ia", "sprint-ia", "landing"],
  },
  "/cas-usage/immobilier": {
    h1: plainTitle("useCases.realEstate", "hero.title"),
    prices: ["audit-ia", "automation", "automation-care", "sprint-ia"],
    faqNamespace: "useCases.realEstate",
  },
  "/cas-usage/agences": {
    h1: plainTitle("useCases.agencies", "hero.title"),
    prices: ["landing", "site-ia", "sprint-ia", "fde"],
    faqNamespace: "useCases.agencies",
  },
  "/cas-usage/cabinets-services": {
    h1: plainTitle("useCases.services", "hero.title"),
    prices: ["audit-ia", "automation", "automation-care", "sprint-ia"],
    faqNamespace: "useCases.services",
  },
  "/faq": {
    h1: plainTitle("faqPage", "hero.title"),
    prices: ["landing", "audit-ia", "sprint-ia"],
  },
  "/contact": { h1: plainTitle("contact", "hero.title") },
  "/blog": { h1: plainTitle("blog", "hero.title") },
  "/blog/[slug]": {
    h1: async (locale, page) => {
      const posts = await getPosts(locale);
      const post = posts.find((p) => p.slug === page.params?.slug);
      if (!post) throw new Error(`No post ${page.params?.slug}`);
      return post.title;
    },
  },
  "/mentions-legales": { h1: plainTitle("legal", "title") },
  "/confidentialite": { h1: plainTitle("privacy", "title") },
};

const RAW_KEY =
  /\b(nav|footer|home|offers|offerPage|useCases|faqPage|sites|agents|fde|audit|automation|geo|pricing|cases|about|bordeaux|contact|blog|legal|privacy|meta|machine)\.[a-z][A-Za-z]*(\.[A-Za-z]+)*\b/;

describe.each(routing.locales)("pageMarkdown (%s)", (locale) => {
  it("covers every route pathname", async () => {
    const pages = await machinePages(locale);
    const covered = new Set(pages.map((page) => page.pathname));
    const withContent = (
      Object.keys(routing.pathnames) as AppPathname[]
    ).filter((pathname) => pathname !== "/blog/[slug]");
    for (const pathname of withContent) expect(covered).toContain(pathname);
  });

  it("mirrors each page: h1, prices, FAQ, no raw keys", async () => {
    const pages = await machinePages(locale);
    for (const page of pages) {
      const expectation = EXPECTATIONS[page.pathname];
      const markdown = await pageMarkdown(locale, page);
      const label = `${locale} ${page.pathname} ${page.params?.slug ?? ""}`;
      if (markdown === null) throw new Error(`No markdown for ${label}`);

      const h1 = await expectation.h1(locale, page);
      expect(markdown.startsWith(`# ${h1}\n`), label).toBe(true);

      for (const id of expectation.prices ?? []) {
        expect(markdown, `${label} ${id}`).toContain(
          formatPrice(getOfferPrice(id), locale),
        );
      }
      if (expectation.fdeMinimum) {
        expect(markdown, label).toContain(
          formatPrice(
            getOfferPrice("fde") * FDE_MIN_DAYS_PER_WEEK * FDE_MIN_WEEKS,
            locale,
          ),
        );
      }
      if (expectation.faqNamespace) {
        const t = getStaticTranslator(locale, expectation.faqNamespace);
        const faq = messageList(
          t,
          "faq.items",
          ["question", "answer"],
          getPriceValues(locale),
        ).filter(
          (_, i) =>
            !expectation.faqKeys ||
            expectation.faqKeys.includes(
              Object.keys(t.raw("faq.items") as object)[i],
            ),
        );
        for (const item of faq) {
          expect(markdown, label).toContain(item.question);
          expect(markdown, label).toContain(item.answer);
        }
      }

      expect(markdown, label).not.toContain("undefined");
      expect(markdown, label).not.toContain("[object Object]");
      expect(markdown, label).not.toMatch(RAW_KEY);
      expect(markdown, label).not.toMatch(/\{[a-zA-Z]+\}/);
      expect(markdown.endsWith("\n"), label).toBe(true);
    }
  });

  it("returns null for unknown slugs and paths", async () => {
    expect(
      await pageMarkdown(locale, {
        pathname: "/realisations/[slug]",
        params: { slug: "nope" },
      }),
    ).toBeNull();
    expect(
      await pageMarkdown(locale, {
        pathname: "/blog/[slug]",
        params: { slug: "nope" },
      }),
    ).toBeNull();
    expect(resolveMachinePage(locale, ["nope"])).toBeNull();
  });

  it("names who works on a project on about", async () => {
    const t = getStaticTranslator(locale, "about");
    const team = getStaticTranslator(locale, "home.team");
    const markdown = await pageMarkdown(locale, { pathname: "/a-propos" });
    expect(markdown).toContain(team("name"));
    expect(markdown).toContain(team("bio"));
    for (const key of ["lead", "agents", "specialists"]) {
      expect(markdown).toContain(t(`team.items.${key}.title`));
      expect(markdown).toContain(t(`team.items.${key}.body`));
    }
  });

  it("links the next case studies from each case study", async () => {
    const cases = await getCaseStudies(locale);
    const markdown = await pageMarkdown(locale, {
      pathname: "/realisations/[slug]",
      params: { slug: cases[0].slug },
    });
    expect(markdown).toContain(cases[1].title);
  });

  it("introduces the founder on home with the measured GitHub total", async () => {
    const home = await pageMarkdown(locale, { pathname: "/" });
    const t = getStaticTranslator(locale, "home");
    const contributions = getGithubContributions();
    expect(home).toContain(t("team.name"));
    expect(home).toContain(t("team.bio"));
    if (contributions) {
      expect(home).toContain(
        new Intl.NumberFormat(locale).format(contributions.total),
      );
    }
  });

  it("links the pillar guides under the home faq", async () => {
    const home = await pageMarkdown(locale, { pathname: "/" });
    const guides = selectHomeGuides(await getPosts(locale));
    expect(guides).toHaveLength(HOME_GUIDES.length);
    for (const post of guides) expect(home).toContain(post.title);
  });

  it("names the tools on home and the deployed stack on agent pages", async () => {
    const names = (groups: ToolGroup[]) =>
      groups.flatMap((group) => group.tools.map((tool) => tool.name));
    const home = await pageMarkdown(locale, { pathname: "/" });
    const homeT = getStaticTranslator(locale, "home");
    expect(home).toContain(homeT("tools.title"));
    for (const { name } of HOME_TOOLS) expect(home).toContain(name);

    const page = getStaticTranslator(locale, "offerPage");
    for (const pathname of [
      "/services/agents-ia",
      "/services/automatisation-ia",
    ] as const) {
      const markdown = await pageMarkdown(locale, { pathname });
      expect(markdown, pathname).toContain(page("stack.label"));
      expect(markdown, pathname).toContain(page("stack.note"));
      for (const name of names(DEPLOYED_TECH)) {
        expect(markdown, pathname).toContain(name);
      }
    }
    const sites = await pageMarkdown(locale, {
      pathname: "/services/creation-site-web",
    });
    expect(sites).not.toContain(page("stack.label"));
  });

  it("carries every visible FAQ question and answer on /faq", async () => {
    const markdown = await pageMarkdown(locale, { pathname: "/faq" });
    const items = faqPageItems(
      getStaticTranslator(locale, ""),
      getPriceValues(locale),
    );
    for (const item of items) {
      expect(markdown).toContain(`### ${item.question}`);
      expect(markdown).toContain(item.answer);
    }
  });

  it("carries the logo credits on the legal page", async () => {
    const t = getStaticTranslator(locale, "legal");
    const markdown = await pageMarkdown(locale, {
      pathname: "/mentions-legales",
    });
    expect(markdown).toContain(t("credits.trademarks"));
    expect(markdown).toContain(t("credits.items.mcp"));
    expect(markdown).toContain("https://creativecommons.org/licenses/by/4.0/");
  });

  it("resolves every page from its own markdown href", async () => {
    for (const page of await machinePages(locale)) {
      const segments = pageMarkdownHref(locale, page)
        .split("/")
        .slice(3)
        .filter(Boolean);
      expect(resolveMachinePage(locale, segments)).toEqual({
        pathname: page.pathname,
        params: page.params ?? {},
      });
    }
  });
});

describe("markdownHref", () => {
  it("maps localized paths under /md/<locale>", () => {
    expect(markdownHref("fr", "/")).toBe("/md/fr");
    expect(markdownHref("en", "/en")).toBe("/md/en");
    expect(markdownHref("fr", "/services/agents-ia")).toBe(
      "/md/fr/services/agents-ia",
    );
    expect(markdownHref("en", "/en/services/ai-agents")).toBe(
      "/md/en/services/ai-agents",
    );
    expect(
      pageMarkdownHref("en", {
        pathname: "/realisations/[slug]",
        params: { slug: "citeme" },
      }),
    ).toBe("/md/en/work/citeme");
  });
});

describe("internalPathname", () => {
  it("maps a filled dynamic path back to its route template", () => {
    expect(internalPathname("/realisations/citeme", { slug: "citeme" })).toBe(
      "/realisations/[slug]",
    );
    expect(internalPathname("/realisations/[slug]", { slug: "citeme" })).toBe(
      "/realisations/[slug]",
    );
    expect(internalPathname("/tarifs", {})).toBe("/tarifs");
  });
});
