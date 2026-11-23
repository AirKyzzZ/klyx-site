import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { getCaseStudies } from "@/lib/content";
import { formatPrice, getOfferPrice } from "@/lib/offers";

import {
  countLiveHomeCases,
  HOME_CLIENTS,
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

describe("HOME_CLIENTS", () => {
  it.each(routing.locales)(
    "links every client logo to a case study in %s",
    async (locale) => {
      const slugs = (await getCaseStudies(locale)).map((study) => study.slug);
      for (const client of HOME_CLIENTS) {
        expect(slugs, client.name).toContain(client.slug);
      }
    },
  );

  it("keeps CiteMe out, it is our own product", () => {
    expect(HOME_CLIENTS.map((client) => client.slug)).not.toContain("citeme");
  });

  it.each(HOME_CLIENTS)("sizes $name from its own SVG", (client) => {
    const svg = readFileSync(join("public", client.logo), "utf8");
    const viewBox = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
    expect(viewBox, client.logo).not.toBeNull();
    const [, width, height] = viewBox!;
    expect(client.ratio).toBeCloseTo(Number(width) / Number(height), 3);
    expect(svg).not.toMatch(/<script|on[a-z]+=|href=/i);
  });
});
