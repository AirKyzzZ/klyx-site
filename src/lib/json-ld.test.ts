import { describe, expect, it } from "vitest";

import fr from "../../messages/fr.json";

import type { CaseStudyMeta } from "./content";
import {
  aboutPageJsonLd,
  blogJsonLd,
  blogPostingJsonLd,
  breadcrumbJsonLd,
  caseListJsonLd,
  caseStudyJsonLd,
  contactPageJsonLd,
  faqJsonLd,
  organizationJsonLd,
  personJsonLd,
  pricingPageJsonLd,
  serviceJsonLd,
  trailPageJsonLd,
  websiteJsonLd,
} from "./json-ld";
import { PRICE_GROUPS } from "./offers";
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
      legalName: site.legalName,
      description: site.description,
      url: "https://klyx.fr",
      founder: { "@id": "https://klyx.fr/#person", name: "Maxime Mansiet" },
    });
    expect(organization).not.toHaveProperty("foundingDate");
    expect(organization.address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Bordeaux",
      addressCountry: "FR",
    });
    expect(organization.areaServed).toEqual([
      { "@type": "City", name: "Bordeaux" },
      { "@type": "AdministrativeArea", name: "Gironde" },
      { "@type": "Country", name: "France" },
    ]);
  });

  it("lists company profiles only in sameAs", () => {
    expect(organizationJsonLd().sameAs).toEqual([
      site.socials.linkedinCompany,
      site.socials.instagram,
    ]);
  });
});

describe("websiteJsonLd", () => {
  it("names the site and points at the organization", () => {
    expect(websiteJsonLd()).toMatchObject({
      "@type": "WebSite",
      "@id": "https://klyx.fr/#website",
      url: "https://klyx.fr",
      inLanguage: ["fr", "en"],
      publisher: { "@id": "https://klyx.fr/#organization" },
    });
  });
});

describe("personJsonLd", () => {
  it("links the founder to Klyx and his public profiles", () => {
    expect(personJsonLd()).toMatchObject({
      "@type": "Person",
      "@id": "https://klyx.fr/#person",
      name: "Maxime Mansiet",
      jobTitle: "Fondateur et lead engineer",
      image: "https://klyx.fr/team/maxime-mansiet.jpg",
      worksFor: { "@id": "https://klyx.fr/#organization" },
      knowsAbout: expect.arrayContaining(["Agents IA", "Next.js"]),
      sameAs: [site.socials.github, site.socials.linkedinFounder],
    });
  });
});

describe("page JSON-LD", () => {
  it("marks /a-propos as an AboutPage with the founder", () => {
    const [page, person] = aboutPageJsonLd("en");
    expect(page).toMatchObject({
      "@type": "AboutPage",
      "@id": "https://klyx.fr/en/about#webpage",
      url: "https://klyx.fr/en/about",
      inLanguage: "en",
      isPartOf: { "@id": "https://klyx.fr/#website" },
      about: { "@id": "https://klyx.fr/#organization" },
    });
    expect(person).toMatchObject({ "@type": "Person" });
  });

  it("marks /contact as a ContactPage", () => {
    expect(contactPageJsonLd("fr")).toMatchObject({
      "@type": "ContactPage",
      url: "https://klyx.fr/contact",
      name: fr.meta.contact.title,
      description: fr.meta.contact.description,
    });
  });

  it("lists every public price and the visible FAQ on /tarifs", () => {
    const [catalog, faq] = pricingPageJsonLd("fr");
    const groups = catalog.itemListElement as {
      name: string;
      itemListElement: Record<string, unknown>[];
    }[];
    expect(catalog).toMatchObject({
      "@type": "OfferCatalog",
      url: "https://klyx.fr/tarifs",
    });
    expect(groups.map((group) => group.name)).toEqual(
      PRICE_GROUPS.map((group) => fr.pricing.table.groups[group.key]),
    );
    const offers = groups.flatMap((group) => group.itemListElement);
    expect(offers).toHaveLength(
      PRICE_GROUPS.flatMap((group) => group.offers).length,
    );
    expect(offers).toContainEqual(
      expect.objectContaining({
        price: 4500,
        priceCurrency: "EUR",
        offeredBy: { "@id": "https://klyx.fr/#organization" },
        itemOffered: expect.objectContaining({
          "@id": "https://klyx.fr/services/agents-ia#sprint-ia",
          name: "Sprint IA",
        }),
      }),
    );
    expect(faq).toMatchObject({
      "@type": "FAQPage",
      mainEntity: Object.values(fr.pricing.faq.items).map((item) => ({
        name: item.question,
        acceptedAnswer: { text: item.answer },
      })),
    });
  });

  const study: CaseStudyMeta = {
    slug: "citeme",
    title: "CiteMe, mesurer sa visibilité",
    client: "CiteMe",
    url: "https://www.citeme.io",
    year: 2026,
    summary: "Un outil GEO.",
    stack: ["Next.js"],
    image: "/realisations/citeme.png",
    order: 1,
  };

  it("lists the case studies on /realisations", () => {
    expect(caseListJsonLd("en", [study])).toMatchObject({
      "@type": "CollectionPage",
      "@id": "https://klyx.fr/en/work#webpage",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: [
          {
            position: 1,
            name: study.title,
            url: "https://klyx.fr/en/work/citeme",
          },
        ],
      },
    });
  });

  it("describes a case study as a CreativeWork with its breadcrumb", () => {
    const [work, breadcrumb] = caseStudyJsonLd("fr", study);
    expect(work).toMatchObject({
      "@type": "CreativeWork",
      url: "https://klyx.fr/realisations/citeme",
      name: study.title,
      image: "https://klyx.fr/realisations/citeme.png",
      dateCreated: "2026",
      creator: { "@id": "https://klyx.fr/#organization" },
      isPartOf: { "@id": "https://klyx.fr/realisations#webpage" },
    });
    expect(breadcrumb).toMatchObject({
      itemListElement: [
        { position: 1, item: "https://klyx.fr/" },
        { position: 2, item: "https://klyx.fr/realisations" },
        { position: 3, item: "https://klyx.fr/realisations/citeme" },
      ],
    });
  });

  it("describes /blog as a Blog listing its posts", () => {
    const blog = blogJsonLd("fr", [
      { slug: "a", title: "A", date: "2026-11-03", summary: "" },
      {
        slug: "b",
        title: "B",
        date: "2026-11-03",
        updated: "2026-11-20",
        summary: "",
      },
    ]);
    expect(blog).toMatchObject({
      "@type": "Blog",
      "@id": "https://klyx.fr/blog#blog",
      publisher: { "@id": "https://klyx.fr/#organization" },
      blogPost: [
        { url: "https://klyx.fr/blog/a", dateModified: "2026-11-03" },
        { url: "https://klyx.fr/blog/b", dateModified: "2026-11-20" },
      ],
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
      image: "https://klyx.fr/en/blog/cout-agent-ia-pme/opengraph-image",
      dateModified: "2026-11-03",
      isPartOf: { "@id": "https://klyx.fr/en/blog#blog" },
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
