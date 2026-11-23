import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { getCaseStudies } from "@/lib/content";
import { formatPrice, getOfferPrice } from "@/lib/offers";

import {
  countLiveHomeCases,
  HOME_OFFER_CARDS,
  selectHomeCases,
} from "./home-sections";
import { pageMarkdown } from "./machine/page-markdown";

describe("HOME_OFFER_CARDS", () => {
  it("anchors the agents card on the Sprint IA price", () => {
    const agents = HOME_OFFER_CARDS.find((card) => card.key === "agents");
    expect(agents?.offer).toBe("sprint-ia");
  });

  it.each(routing.locales)(
    "puts the Sprint price under the agents card in the %s markdown",
    async (locale) => {
      const t = getStaticTranslator(locale, "home");
      const markdown = await pageMarkdown(locale, { pathname: "/" });
      const sprintLine = t("offers.cards.agents.price", {
        price: formatPrice(getOfferPrice("sprint-ia"), locale),
      });
      const agentsBlock = markdown?.split(
        `### ${t("offers.cards.agents.name")}`,
      )[1];
      expect(agentsBlock?.split("\n###")[0]).toContain(sprintLine);
    },
  );
});

describe("countLiveHomeCases", () => {
  it("leaves out home cases that are not live", async () => {
    const cases = await getCaseStudies("fr");
    const home = selectHomeCases(cases);
    const offline = home.filter((study) => study.live === false);
    expect(offline.map((study) => study.slug)).toContain("cronolyss");
    expect(countLiveHomeCases(cases)).toBe(home.length - offline.length);
  });
});
