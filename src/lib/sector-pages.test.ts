import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { messageList } from "@/i18n/message-list";
import { routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";

import { getPriceValues } from "./offers";
import { COMMON_TASKS, SECTOR_KEYS, sectorPages } from "./sector-pages";

const MESSAGES = { fr, en } as const;
const words = (text: string) => text.trim().split(/\s+/).length;

describe("sectorPages", () => {
  it("routes every sector page and anchors on an offer it shows", () => {
    for (const key of SECTOR_KEYS) {
      const config = sectorPages[key];
      expect(Object.keys(routing.pathnames)).toContain(config.pathname);
      expect(config.offers, key).toContain(config.anchor);
      expect(config.offers, key).toContain(config.quoteOffer);
    }
  });

  it("shows real cases only where a client case or site exists", () => {
    expect(sectorPages.realEstate.proof).toEqual({
      kind: "cases",
      slugs: ["hop-hop-immo"],
    });
    expect(sectorPages.agencies.proof).toEqual({
      kind: "cases",
      slugs: ["pkba", "vertiflow"],
    });
    expect(sectorPages.services.proof.kind).toBe("none");
  });

  describe.each(routing.locales)("messages (%s)", (locale) => {
    const prices = getPriceValues(locale);

    it("gives each use-case page a one-part h1 without eyebrow or serif word", () => {
      for (const key of [
        ...SECTOR_KEYS.map((k) => `useCases.${k}`),
        "useCases",
        "bordeaux",
      ]) {
        const hero = getStaticTranslator(locale, key).raw("hero") as object;
        expect(Object.keys(hero), key).not.toContain("titleEmphasis");
        expect(Object.keys(hero), key).not.toContain("eyebrow");
        expect(Object.keys(hero), key).not.toContain("serif");
      }
    });

    it("keeps sector FAQ answers between 40 and 80 words", () => {
      for (const key of SECTOR_KEYS) {
        const t = getStaticTranslator(locale, `useCases.${key}`);
        const faq = messageList(t, "faq.items", ["question", "answer"], prices);
        expect(faq.length, key).toBeGreaterThanOrEqual(3);
        for (const item of faq) {
          const count = words(item.answer);
          expect(count, item.question).toBeGreaterThanOrEqual(40);
          expect(count, item.question).toBeLessThanOrEqual(80);
        }
      }
    });

    it("describes four tasks per sector, each with tool logos and a human check", () => {
      for (const key of SECTOR_KEYS) {
        const { workflows } = sectorPages[key];
        const t = getStaticTranslator(locale, `useCases.${key}.workflows`);
        expect(Object.keys(t.raw("items") as object), key).toEqual(
          workflows.map((task) => task.id),
        );
        for (const task of workflows) {
          expect(task.from.length + task.to.length, task.id).toBeGreaterThan(1);
          for (const field of ["category", "title", "agent", "team"]) {
            expect(t(`items.${task.id}.${field}`), task.id).toBeTruthy();
          }
        }
      }
      const common = getStaticTranslator(locale, "useCases.common");
      expect(Object.keys(common.raw("items") as object)).toEqual(
        COMMON_TASKS.map((task) => task.id),
      );
    });

    it("writes pricing copy for every offer card it shows", () => {
      for (const key of SECTOR_KEYS) {
        const t = getStaticTranslator(locale, `useCases.${key}.pricing`);
        expect(Object.keys(t.raw("cards") as object), key).toEqual(
          sectorPages[key].offers,
        );
      }
    });

    it("keeps titles under 60 and descriptions under 155 characters", () => {
      const meta = getStaticTranslator(locale, "meta");
      for (const key of [...SECTOR_KEYS, "useCases", "faq", "bordeaux"]) {
        expect(meta(`${key}.title`).length, key).toBeLessThanOrEqual(60);
        expect(
          meta(`${key}.description`, prices).length,
          key,
        ).toBeLessThanOrEqual(155);
      }
    });

    it("shows no pending marker", () => {
      const messages = MESSAGES[locale];
      for (const value of [
        messages.useCases,
        messages.faqPage,
        messages.bordeaux,
      ]) {
        expect(JSON.stringify(value)).not.toContain("TODO(maxime)");
      }
    });
  });
});
