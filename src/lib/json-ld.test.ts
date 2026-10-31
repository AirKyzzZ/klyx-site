import { describe, expect, it } from "vitest";

import {
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  personJsonLd,
  serviceJsonLd,
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
