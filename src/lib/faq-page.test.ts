import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";

import { FAQ_THEMES, faqPageItems } from "./faq-page";
import { getPriceValues } from "./offers";

const MESSAGES = { fr, en } as const;
const SITE_FAQ_NAMESPACES = [
  "home",
  "sites",
  "agents",
  "fde",
  "audit",
  "automation",
  "geo",
  "pricing",
  "bordeaux",
] as const;
const DUPLICATES = [
  "agents.data",
  "automation.data",
  "bordeaux.data",
  "bordeaux.price",
  "bordeaux.subsidy",
  "audit.bpifrance",
  "sites.geo",
];

const words = (text: string) => text.trim().split(/\s+/).length;

describe.each(routing.locales)("faq page (%s)", (locale) => {
  const items = faqPageItems(
    getStaticTranslator(locale, ""),
    getPriceValues(locale),
  );

  it("lists every site FAQ once, except known duplicates", () => {
    const listed = new Set(
      FAQ_THEMES.flatMap((theme) =>
        theme.items.map(([ns, key]) => `${ns}.${key}`),
      ),
    );
    for (const ns of SITE_FAQ_NAMESPACES) {
      for (const key of Object.keys(MESSAGES[locale][ns].faq.items)) {
        const id = `${ns}.${key}`;
        expect(listed.has(id) || DUPLICATES.includes(id), id).toBe(true);
        expect(listed.has(id) && DUPLICATES.includes(id), id).toBe(false);
      }
    }
  });

  it("has unique anchors and questions, no pending marker", () => {
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    expect(new Set(items.map((item) => item.question)).size).toBe(items.length);
    for (const item of items) {
      expect(item.answer, item.id).not.toContain("TODO(maxime)");
      expect(item.answer, item.id).not.toMatch(/\{[a-zA-Z]+\}/);
      expect(item.id).toMatch(/^[a-z-]+$/);
    }
  });

  it("adds at most 6 new questions of 40 to 80 words", () => {
    const own = Object.values(MESSAGES[locale].faqPage.faq.items);
    expect(own.length).toBeLessThanOrEqual(6);
    for (const item of own) {
      const count = words(item.answer);
      expect(count, item.question).toBeGreaterThanOrEqual(40);
      expect(count, item.question).toBeLessThanOrEqual(80);
    }
  });
});
