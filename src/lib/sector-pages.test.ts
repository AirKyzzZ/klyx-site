import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { messageList } from "@/i18n/message-list";
import { routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";

import { getPriceValues } from "./offers";
import { scenarios } from "./scenarios";
import { SECTOR_KEYS, sectorPages } from "./sector-pages";

const MESSAGES = { fr, en } as const;
const words = (text: string) => text.trim().split(/\s+/).length;

describe("sectorPages", () => {
  it("routes every sector page and anchors on an offer it shows", () => {
    for (const key of SECTOR_KEYS) {
      const config = sectorPages[key];
      expect(Object.keys(routing.pathnames)).toContain(config.pathname);
      expect(config.offers, key).toContain(config.anchor);
      expect(scenarios[config.scenario].href, key).toBe(config.pathname);
    }
  });

  it("shows a case card only for real estate, the one sector with a client case", () => {
    expect(sectorPages.realEstate.proof).toEqual({
      kind: "cases",
      slugs: ["hop-hop-immo"],
    });
    expect(sectorPages.services.proof.kind).toBe("none");
    expect(sectorPages.services.illustrated).toBe(true);
  });

  describe.each(routing.locales)("messages (%s)", (locale) => {
    const prices = getPriceValues(locale);

    it("puts the serif word in each h1", () => {
      for (const key of [
        ...SECTOR_KEYS.map((k) => `useCases.${k}`),
        "useCases",
      ]) {
        const t = getStaticTranslator(locale, key);
        expect(`${t("hero.title")} ${t("hero.titleEmphasis")}`, key).toContain(
          t("hero.serif"),
        );
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

    it("describes 2 to 4 workflows with steps and tools", () => {
      for (const key of SECTOR_KEYS) {
        const t = getStaticTranslator(locale, `useCases.${key}.workflows`);
        const examples = Object.keys(t.raw("examples") as object);
        expect(examples.length, key).toBeGreaterThanOrEqual(2);
        expect(examples.length, key).toBeLessThanOrEqual(4);
        for (const id of examples) {
          for (const step of ["trigger", "ai", "human", "action"]) {
            expect(t(`examples.${id}.steps.${step}`)).toBeTruthy();
          }
          expect(t(`examples.${id}.tools`)).toBeTruthy();
        }
      }
    });

    it("keeps titles under 60 and descriptions under 155 characters", () => {
      const meta = getStaticTranslator(locale, "meta");
      for (const key of [...SECTOR_KEYS, "useCases", "faq"]) {
        expect(meta(`${key}.title`).length, key).toBeLessThanOrEqual(60);
        expect(
          meta(`${key}.description`, prices).length,
          key,
        ).toBeLessThanOrEqual(155);
      }
    });

    it("shows no pending marker", () => {
      const messages = MESSAGES[locale];
      for (const value of [messages.useCases, messages.faqPage]) {
        expect(JSON.stringify(value)).not.toContain("TODO(maxime)");
      }
    });
  });
});
