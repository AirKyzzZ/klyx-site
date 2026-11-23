import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";
import { getCaseStudies } from "@/lib/content";

import { formatPrice, getOfferPrice } from "./offers";
import {
  OUTREACH_KEYS,
  outreachCopyText,
  outreachMetadata,
  outreachPages,
} from "./outreach-pages";
import { isOutreachPath, OUTREACH_PATHS } from "./outreach-paths";
import { brandedTitle } from "./seo";

const words = (text: string) => text.trim().split(/\s+/).length;

describe("outreachPages", () => {
  it("lives under /pour, outside the localized routes", () => {
    expect(OUTREACH_KEYS.map((key) => outreachPages[key].path)).toEqual([
      ...OUTREACH_PATHS,
    ]);
    const localized = Object.values(routing.pathnames).flatMap((value) =>
      typeof value === "string" ? [value] : Object.values(value),
    );
    for (const path of OUTREACH_PATHS) {
      expect(localized).not.toContain(path);
      expect(isOutreachPath(path)).toBe(true);
    }
    expect(isOutreachPath("/pour")).toBe(false);
    expect(isOutreachPath("/tarifs")).toBe(false);
  });

  it.each(OUTREACH_KEYS)("%s keeps to 400-600 words", (key) => {
    const count = words(outreachCopyText(outreachPages[key]));
    expect(count).toBeGreaterThanOrEqual(400);
    expect(count).toBeLessThanOrEqual(600);
  });

  it.each(OUTREACH_KEYS)("%s has 4 to 6 sections", (key) => {
    const total = outreachPages[key].sections.length + 2;
    expect(total).toBeGreaterThanOrEqual(4);
    expect(total).toBeLessThanOrEqual(6);
  });

  it.each(OUTREACH_KEYS)(
    "%s speaks as « on/nous » and never writes the forbidden phrase",
    (key) => {
      const text = outreachCopyText(outreachPages[key]);
      expect(text).not.toMatch(/(^|[\s.,:;!?«])(Je|je|J'|j')\b/);
      expect(text.toLowerCase()).not.toContain("développeur embarqué");
      expect(text).not.toContain("TODO");
      expect(text).not.toMatch(/\bsenior\b/i);
    },
  );

  it.each(OUTREACH_KEYS)(
    "%s shows a public price under the CTA and five logos on each side",
    (key) => {
      const { hero, backdrop } = outreachPages[key];
      expect(hero.note).toMatch(/\d\u00a0€\u00a0HT/);
      expect(backdrop.sources).toHaveLength(5);
      expect(backdrop.destinations).toHaveLength(5);
    },
  );

  it("matches the h1 to the DM noun phrase", () => {
    expect(outreachPages.agencies.hero.title).toBe(
      "Vos clients demandent de l'IA. On la livre sous votre marque.",
    );
    expect(outreachPages.startups.hero.title).toBe(
      "Votre feature IA en production en 2 semaines, pas dans un prototype.",
    );
  });

  it("prices the Sprint from offers.ts and never shows the day rate", () => {
    const text = outreachCopyText(outreachPages.startups);
    expect(text).toContain(formatPrice(getOfferPrice("sprint-ia"), "fr"));
    expect(text).not.toContain(formatPrice(getOfferPrice("fde"), "fr"));
    expect(text).not.toMatch(/\/\s?jour|par jour|TJM/i);
    expect(outreachPages.startups.sections).not.toContainEqual(
      expect.objectContaining({ kind: "pricing" }),
    );
  });

  it("shows agency prices from offers.ts", () => {
    const pricing = outreachPages.agencies.sections.find(
      (section) => section.kind === "pricing",
    );
    expect(
      pricing?.kind === "pricing" && pricing.offers.map((offer) => offer.id),
    ).toEqual(["landing", "site-ia", "sprint-ia"]);
  });

  it("frames white-label terms as proposals agreed in writing", () => {
    const terms = outreachPages.agencies.sections.find(
      (section) => section.kind === "list" && section.id === "terms",
    );
    expect(terms?.body).toMatch(/par écrit/);
    expect(terms?.body).toMatch(/propose/);
  });

  it.each(OUTREACH_KEYS)("%s only shows listed case studies", async (key) => {
    const listed = (await getCaseStudies("fr")).map((study) => study.slug);
    for (const section of outreachPages[key].sections) {
      if (section.kind !== "cases") continue;
      expect(section.slugs.length).toBeGreaterThan(0);
      for (const slug of section.slugs) expect(listed).toContain(slug);
    }
  });

  it.each(OUTREACH_KEYS)(
    "%s metadata is noindex, nofollow with a self canonical and its own OG image",
    (key) => {
      const page = outreachPages[key];
      const meta = outreachMetadata(page);
      const url = `https://klyx.fr${page.path}`;
      expect(meta.robots).toEqual({ index: false, follow: false });
      expect(meta.alternates).toEqual({ canonical: url });
      expect(meta.openGraph).not.toHaveProperty("alternateLocale");
      expect(meta.openGraph?.url).toBe(url);
      expect(meta.openGraph?.images).toEqual([
        expect.objectContaining({ url: `${url}/opengraph-image` }),
      ]);
      expect(meta.title).toEqual({ absolute: brandedTitle(page.meta.title) });
    },
  );
});
