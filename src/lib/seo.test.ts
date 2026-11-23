import { describe, expect, it } from "vitest";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

import { blogPostingJsonLd } from "./json-ld";
import { getPriceValues } from "./offers";
import { outreachPages } from "./outreach-pages";
import { brandedTitle, buildMetadata, ogImageUrl } from "./seo";

describe("buildMetadata", () => {
  it("sets the canonical and hreflang alternates for a localized route", () => {
    const metadata = buildMetadata({
      locale: "en",
      pathname: "/tarifs",
      title: "Pricing | Klyx",
      description: "All Klyx prices.",
    });
    expect(metadata.alternates).toEqual({
      canonical: "https://klyx.fr/en/pricing",
      languages: {
        fr: "https://klyx.fr/tarifs",
        en: "https://klyx.fr/en/pricing",
        "x-default": "https://klyx.fr/tarifs",
      },
      types: { "text/markdown": "https://klyx.fr/md/en/pricing" },
    });
  });

  it("uses an absolute title and a per-page OpenGraph url", () => {
    const metadata = buildMetadata({
      locale: "fr",
      pathname: "/",
      title: "Klyx | Agents IA",
      description: "Accueil.",
    });
    expect(metadata.title).toEqual({ absolute: "Klyx | Agents IA" });
    expect(metadata.description).toBe("Accueil.");
    expect(metadata.openGraph).toMatchObject({
      url: "https://klyx.fr/",
      title: "Klyx | Agents IA",
      siteName: "Klyx",
      locale: "fr_FR",
      type: "website",
      images: [{ url: "https://klyx.fr/fr/opengraph-image" }],
    });
  });

  it("points offer and pricing pages at their own OpenGraph image", () => {
    const pricing = buildMetadata({
      locale: "en",
      pathname: "/tarifs",
      title: "Pricing",
      description: "Prices.",
    });
    expect(pricing.openGraph).toMatchObject({
      images: [{ url: "https://klyx.fr/en/tarifs/opengraph-image" }],
    });
    const cases = buildMetadata({
      locale: "fr",
      pathname: "/realisations/[slug]",
      params: { slug: "citeme" },
      title: "CiteMe",
      description: "Projet.",
      type: "article",
    });
    expect(cases.openGraph).toMatchObject({
      type: "article",
      images: [
        { url: "https://klyx.fr/fr/realisations/citeme/opengraph-image" },
      ],
    });
    expect(cases.twitter).toMatchObject({
      card: "summary_large_image",
      title: "CiteMe",
      images: [
        { url: "https://klyx.fr/fr/realisations/citeme/opengraph-image" },
      ],
    });
    const legal = buildMetadata({
      locale: "en",
      pathname: "/mentions-legales",
      title: "Legal notice",
      description: "Legal.",
    });
    expect(legal.openGraph).toMatchObject({
      locale: "en_US",
      images: [{ url: "https://klyx.fr/en/opengraph-image" }],
    });
  });

  it("fills dynamic segments", () => {
    const metadata = buildMetadata({
      locale: "fr",
      pathname: "/realisations/[slug]",
      params: { slug: "citeme" },
      title: "CiteMe | Klyx",
      description: "Étude de cas.",
    });
    expect(metadata.alternates?.canonical).toBe(
      "https://klyx.fr/realisations/citeme",
    );
    expect(metadata.alternates?.languages).toMatchObject({
      en: "https://klyx.fr/en/work/citeme",
    });
  });
});

describe("ogImageUrl", () => {
  it("gives each blog post its own image, shared by OpenGraph and JSON-LD", () => {
    const params = { slug: "cout-agent-ia-pme" };
    const url = ogImageUrl("fr", "/blog/[slug]", params);
    expect(url).toBe(
      "https://klyx.fr/fr/blog/cout-agent-ia-pme/opengraph-image",
    );
    const metadata = buildMetadata({
      locale: "fr",
      pathname: "/blog/[slug]",
      params,
      title: "Titre",
      description: "Résumé",
      type: "article",
    });
    expect(metadata.openGraph).toMatchObject({ images: [{ url }] });
    const [article] = blogPostingJsonLd({
      locale: "fr",
      slug: params.slug,
      title: "Titre",
      summary: "Résumé",
      date: "2026-11-03",
    });
    expect(article.image).toBe(url);
  });
});

describe("brandedTitle", () => {
  it("adds the brand when it fits in 60 characters", () => {
    expect(brandedTitle("Hop Hop Immo")).toBe("Hop Hop Immo | Klyx");
  });

  it("keeps long titles unbranded", () => {
    const long = "A".repeat(55);
    expect(brandedTitle(long)).toBe(long);
  });
});

describe("meta lengths", () => {
  const MESSAGES = { fr, en } as const;
  const fill = (text: string, values: Record<string, string>) =>
    text.replace(/\{(\w+)\}/g, (_, name: string) => values[name] ?? "");

  it.each(["fr", "en"] as const)(
    "keeps %s titles within 60 and descriptions within 160 characters",
    (locale) => {
      const values: Record<string, string> = getPriceValues(locale);
      for (const [key, entry] of Object.entries(MESSAGES[locale].meta)) {
        if (typeof entry !== "object") continue;
        const title = fill(entry.title, values);
        const description = fill(entry.description, values);
        expect(title.length, `${key}.title: ${title}`).toBeLessThanOrEqual(60);
        expect(
          description.length,
          `${key}.description: ${description}`,
        ).toBeLessThanOrEqual(160);
      }
    },
  );

  it("keeps outreach page titles and descriptions within limits", () => {
    for (const [key, page] of Object.entries(outreachPages)) {
      expect(page.meta.title.length, key).toBeLessThanOrEqual(60);
      expect(page.meta.description.length, key).toBeLessThanOrEqual(160);
    }
  });
});
