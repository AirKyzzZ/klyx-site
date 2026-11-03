import { describe, expect, it } from "vitest";

import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  personJsonLd,
  serviceJsonLd,
  trailPageJsonLd,
} from "./json-ld";
import { site } from "./site";

describe("serviceJsonLd", () => {
  it("emits an EUR offer excluding VAT with the public price", () => {
    const [service] = serviceJsonLd(["sprint-ia"], "fr");
    expect(service).toMatchObject({
      "@type": "Service",
      name: "Sprint IA",
      url: "https://klyx.fr/services/agents-ia",
      provider: { "@id": "https://klyx.fr/#organization" },
      offers: {
        "@type": "Offer",
        price: 4500,
        priceCurrency: "EUR",
        priceSpecification: {
          price: 4500,
          priceCurrency: "EUR",
          valueAddedTaxIncluded: false,
        },
      },
    });
  });

  it("localizes names and urls", () => {
    const [service] = serviceJsonLd(["fde"], "en");
    expect(service).toMatchObject({
      url: "https://klyx.fr/en/forward-deployed-engineer",
      offers: { price: 700, priceSpecification: { unitCode: "DAY" } },
    });
  });

  it("points the new offers at their own pages", () => {
    const [audit, automation, geoCare] = serviceJsonLd(
      ["audit-ia", "automation", "geo-care"],
      "en",
    );
    expect(audit).toMatchObject({
      url: "https://klyx.fr/en/services/ai-audit",
      offers: { price: 1500 },
    });
    expect(automation).toMatchObject({
      url: "https://klyx.fr/en/services/ai-automation",
      offers: { price: 2400 },
    });
    expect(geoCare).toMatchObject({
      url: "https://klyx.fr/en/services/ai-search-visibility",
      offers: { price: 590, priceSpecification: { unitCode: "MON" } },
    });
  });

  it("omits the price of offers without a public price", () => {
    const [service] = serviceJsonLd(["retainer"], "fr");
    expect(service.offers).not.toHaveProperty("price");
    expect(service.offers).toMatchObject({
      priceCurrency: "EUR",
      priceSpecification: { valueAddedTaxIncluded: false },
    });
  });
});

describe("faqJsonLd", () => {
  it("maps items to Question and acceptedAnswer", () => {
    expect(faqJsonLd([{ q: "Combien ?", a: "4 500 € HT." }])).toMatchObject({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Combien ?",
          acceptedAnswer: { "@type": "Answer", text: "4 500 € HT." },
        },
      ],
    });
  });
});

describe("breadcrumbJsonLd", () => {
  it("numbers list items from 1", () => {
    const crumbs = breadcrumbJsonLd([
      { name: "Accueil", url: "https://klyx.fr/" },
      { name: "Tarifs", url: "https://klyx.fr/tarifs" },
    ]);
    expect(crumbs).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, item: "https://klyx.fr/" },
        { "@type": "ListItem", position: 2, name: "Tarifs" },
      ],
    });
  });
});

describe("organizationJsonLd", () => {
  it("describes Klyx as a professional service in Bordeaux", () => {
    const organization = organizationJsonLd();
    expect(organization).toMatchObject({
      "@type": ["Organization", "ProfessionalService"],
      "@id": "https://klyx.fr/#organization",
      name: "Klyx",
      url: "https://klyx.fr",
      founder: { "@type": "Person", name: "Maxime Mansiet" },
    });
    expect(organization.areaServed).toEqual([
      { "@type": "City", name: "Bordeaux" },
      { "@type": "AdministrativeArea", name: "Nouvelle-Aquitaine" },
      { "@type": "Country", name: "France" },
    ]);
    expect(organization.sameAs).toEqual(
      expect.arrayContaining([
        site.socials.linkedinCompany,
        site.socials.instagram,
      ]),
    );
  });
});

describe("personJsonLd", () => {
  it("links the founder to Klyx and his public profiles", () => {
    expect(personJsonLd()).toMatchObject({
      "@type": "Person",
      name: "Maxime Mansiet",
      worksFor: { "@id": "https://klyx.fr/#organization" },
      sameAs: [site.socials.linkedinFounder, site.socials.github],
    });
  });
});

describe("trailPageJsonLd", () => {
  it("chains home, the trail, offers and faq", () => {
    const data = trailPageJsonLd({
      locale: "en",
      trail: [
        { name: "Use cases", pathname: "/cas-usage" },
        { name: "Real estate", pathname: "/cas-usage/immobilier" },
      ],
      offerIds: ["audit-ia"],
      faq: [{ question: "Q?", answer: "A." }],
    });
    expect(data.map((item) => item["@type"])).toEqual([
      "Service",
      "FAQPage",
      "BreadcrumbList",
    ]);
    expect(data[2]).toMatchObject({
      itemListElement: [
        { position: 1, item: "https://klyx.fr/en" },
        { position: 2, item: "https://klyx.fr/en/use-cases" },
        { position: 3, item: "https://klyx.fr/en/use-cases/real-estate" },
      ],
    });
  });

  it("omits FAQPage without questions", () => {
    const data = trailPageJsonLd({
      locale: "fr",
      trail: [{ name: "FAQ", pathname: "/faq" }],
    });
    expect(data.map((item) => item["@type"])).toEqual(["BreadcrumbList"]);
  });
});

describe("blogPostingJsonLd", () => {
  const post = {
    slug: "cout-agent-ia-pme",
    title: "Titre",
    summary: "Résumé",
    date: "2026-11-03",
  };

  it("links the author, publisher and localized url", () => {
    const [article] = blogPostingJsonLd({ ...post, locale: "en" });
    expect(article).toMatchObject({
      "@type": "BlogPosting",
      url: "https://klyx.fr/en/blog/cout-agent-ia-pme",
      inLanguage: "en",
      image: "https://klyx.fr/en/opengraph-image",
      dateModified: "2026-11-03",
      author: { "@id": `${site.url}/#person`, name: site.founder },
      publisher: { "@id": `${site.url}/#organization` },
    });
    expect(article).not.toHaveProperty("citation");
  });

  it("uses the update date and cites the sources", () => {
    const [article, breadcrumb] = blogPostingJsonLd({
      ...post,
      locale: "fr",
      updated: "2026-12-01",
      sources: [{ title: "Insee", url: "https://www.insee.fr/x" }],
    });
    expect(article).toMatchObject({
      dateModified: "2026-12-01",
      citation: [{ name: "Insee", url: "https://www.insee.fr/x" }],
    });
    expect(breadcrumb).toMatchObject({ "@type": "BreadcrumbList" });
  });
});
