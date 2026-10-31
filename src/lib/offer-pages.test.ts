import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { routing } from "@/i18n/routing";

import { getOffer, getPriceValues } from "./offers";
import { OFFER_PAGE_KEYS, type OfferPageKey, offerPages } from "./offer-pages";
import { scenarios } from "./scenarios";

const MESSAGES = { fr, en } as const;
const REQUIRED = ["hero", "problem", "deliverables", "process", "faq", "cta"];
const NEW_PAGES: OfferPageKey[] = ["audit", "automation", "geo"];

type Faq = Record<string, { question: string; answer: string }>;

function namespace(locale: keyof typeof MESSAGES, key: OfferPageKey) {
  const messages: Record<string, unknown> = MESSAGES[locale];
  const value = messages[offerPages[key].namespace];
  if (typeof value !== "object" || value === null) {
    throw new Error(`Missing namespace ${key} in ${locale}`);
  }
  return value as Record<string, unknown> & {
    hero: Record<string, string>;
    faq: { items: Faq };
  };
}

function fill(text: string, locale: keyof typeof MESSAGES) {
  const values: Record<string, string> = getPriceValues(locale);
  return text.replace(/\{(\w+)\}/g, (_, name: string) => values[name] ?? "");
}

const words = (text: string) => text.trim().split(/\s+/).length;

describe("offerPages", () => {
  it("covers the six offer pages with routed pathnames", () => {
    expect(OFFER_PAGE_KEYS).toHaveLength(6);
    for (const key of OFFER_PAGE_KEYS) {
      expect(Object.keys(routing.pathnames)).toContain(
        offerPages[key].pathname,
      );
    }
  });

  it("points each scenario back at its own page", () => {
    for (const key of OFFER_PAGE_KEYS) {
      const config = offerPages[key];
      expect(scenarios[config.scenario].href, key).toBe(config.pathname);
    }
  });

  it("highlights and anchors on offers it lists or owns", () => {
    for (const key of OFFER_PAGE_KEYS) {
      const config = offerPages[key];
      if (config.highlighted)
        expect(config.tiers).toContain(config.highlighted);
      expect(getOffer(config.anchor).priceFrom, key).not.toBeNull();
    }
  });

  it("anchors each new page on the offer that lives there", () => {
    for (const key of NEW_PAGES) {
      expect(getOffer(offerPages[key].anchor).page).toBe(
        offerPages[key].pathname,
      );
    }
  });

  it("shows no proof slot on audit and automation until a real case exists", () => {
    for (const key of ["audit", "automation"] as const) {
      expect(offerPages[key].proofLink, key).toBeNull();
      expect(offerPages[key].proofSlugs, key).toEqual([]);
    }
  });

  describe.each(["fr", "en"] as const)("messages (%s)", (locale) => {
    it("has proof copy exactly where a proof slot renders", () => {
      for (const key of OFFER_PAGE_KEYS) {
        const hasProof = offerPages[key].proofLink !== null;
        expect("proof" in namespace(locale, key), key).toBe(hasProof);
      }
    });

    it("has every template section for every page", () => {
      for (const key of OFFER_PAGE_KEYS) {
        const messages = namespace(locale, key);
        for (const section of REQUIRED) {
          expect(messages, `${key}.${section}`).toHaveProperty(section);
        }
      }
    });

    it("places each page's serif word in its h1", () => {
      for (const key of OFFER_PAGE_KEYS) {
        const { title, titleEmphasis, serif } = namespace(locale, key).hero;
        expect(serif, key).toBeTruthy();
        expect(`${title} ${titleEmphasis}`, key).toContain(serif);
      }
    });

    it("keeps new FAQ answers between 40 and 80 words", () => {
      for (const key of NEW_PAGES) {
        for (const [id, item] of Object.entries(
          namespace(locale, key).faq.items,
        )) {
          const count = words(fill(item.answer, locale));
          expect(count, `${key}.${id}: ${count} words`).toBeGreaterThanOrEqual(
            40,
          );
          expect(count, `${key}.${id}: ${count} words`).toBeLessThanOrEqual(80);
        }
      }
    });

    it("has 5 to 8 FAQ items on new pages", () => {
      for (const key of NEW_PAGES) {
        const count = Object.keys(namespace(locale, key).faq.items).length;
        expect(count, key).toBeGreaterThanOrEqual(5);
        expect(count, key).toBeLessThanOrEqual(8);
      }
    });

    it("never repeats a FAQ question or answer across pages", () => {
      const seen = new Map<string, string>();
      for (const key of OFFER_PAGE_KEYS) {
        for (const [id, item] of Object.entries(
          namespace(locale, key).faq.items,
        )) {
          for (const text of [item.question, item.answer]) {
            expect(seen.get(text), `${key}.${id}`).toBeUndefined();
            seen.set(text, `${key}.${id}`);
          }
        }
      }
    });
  });
});
