import { describe, expect, it } from "vitest";

import { brandedTitle, buildMetadata } from "./seo";

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

describe("brandedTitle", () => {
  it("adds the brand when it fits in 60 characters", () => {
    expect(brandedTitle("Hop Hop Immo")).toBe("Hop Hop Immo | Klyx");
  });

  it("keeps long titles unbranded", () => {
    const long = "A".repeat(55);
    expect(brandedTitle(long)).toBe(long);
  });
});
