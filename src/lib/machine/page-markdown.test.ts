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
import { teamRoster } from "@/lib/team-roster";

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
};

const heroTitle = (namespace: string) => (locale: Locale) => {
  const t = getStaticTranslator(locale, namespace);
  return `${t("hero.title")} ${t("hero.titleEmphasis")}`;
};

const plainTitle = (namespace: string, key: string) => (locale: Locale) =>
  getStaticTranslator(locale, namespace)(key);

const EXPECTATIONS: Record<AppPathname, Expectation> = {
  "/": {
    h1: heroTitle("home"),
    prices: ["landing", "site-ia", "audit-ia", "sprint-ia", "fde"],
    faqNamespace: "home",
  },
  "/services/creation-site-web": {
    h1: heroTitle("sites"),
    prices: ["landing", "site-ia", "site-custom"],
    faqNamespace: "sites",
  },
  "/services/agents-ia": {
    h1: heroTitle("agents"),
    prices: ["audit-ia", "sprint-ia"],
    faqNamespace: "agents",
  },
  "/services/audit-ia": {
    h1: heroTitle("audit"),
    prices: ["audit-ia", "automation", "sprint-ia"],
    faqNamespace: "audit",
  },
  "/services/automatisation-ia": {
    h1: heroTitle("automation"),
    prices: ["automation", "automation-care", "sprint-ia"],
    faqNamespace: "automation",
  },
  "/services/geo-referencement-ia": {
    h1: heroTitle("geo"),
    prices: ["geo", "geo-care", "site-ia"],
    faqNamespace: "geo",
  },
  "/forward-deployed-engineer": {
    h1: heroTitle("fde"),
    prices: ["fde"],
    fdeMinimum: true,
    faqNamespace: "fde",
  },
  "/tarifs": {
    h1: heroTitle("pricing"),
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
  "/realisations": { h1: heroTitle("cases") },
  "/realisations/[slug]": {
    h1: async (locale, page) => {
      const cases = await getCaseStudies(locale);
      const study = cases.find((c) => c.slug === page.params?.slug);
      if (!study) throw new Error(`No case study ${page.params?.slug}`);
      return study.title;
    },
  },
  "/a-propos": { h1: heroTitle("about") },
  "/agence-ia-bordeaux": {
    h1: heroTitle("bordeaux"),
    prices: ["audit-ia", "automation"],
    faqNamespace: "bordeaux",
  },
  "/contact": { h1: heroTitle("contact") },
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
  /\b(nav|footer|home|offers|offerPage|sites|agents|fde|audit|automation|geo|liveSystem|pricing|cases|about|bordeaux|contact|blog|legal|privacy|meta|machine)\.[a-z][A-Za-z]*(\.[A-Za-z]+)*\b/;

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

  it("lists the team roster on home and about", async () => {
    const roster = teamRoster(
      getStaticTranslator(locale, "home.founder"),
      "roster",
    );
    for (const pathname of ["/", "/a-propos"] as const) {
      const markdown = await pageMarkdown(locale, { pathname });
      for (const item of roster.items) {
        expect(markdown, pathname).toContain(item.who);
        expect(markdown, pathname).toContain(item.scope);
      }
    }
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
