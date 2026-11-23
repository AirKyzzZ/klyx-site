import { readdirSync } from "node:fs";

import { expect, type Page, test } from "@playwright/test";

import { formatPrice } from "../src/lib/offers";
import { site } from "../src/lib/site";

type JsonLdNode = Record<string, unknown>;

async function jsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  return scripts.flatMap((text) => [JSON.parse(text)].flat() as JsonLdNode[]);
}

const hasType = (node: JsonLdNode, type: string) =>
  [node["@type"]].flat().includes(type);

test("robots, sitemap and llms.txt are served", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap: https://klyx.fr/sitemap.xml");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("https://klyx.fr/en/pricing");

  const llms = await request.get("/llms.txt");
  expect(llms.status()).toBe(200);
  expect(await llms.text()).toMatch(/^# Klyx/);
});

test("/en/pricing declares canonical and hreflang alternates", async ({
  page,
}) => {
  await page.goto("/en/pricing");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://klyx.fr/en/pricing",
  );
  await expect(
    page.locator('link[rel="alternate"][hreflang="x-default"]'),
  ).toHaveAttribute("href", "https://klyx.fr/tarifs");
  await expect(
    page.locator('meta[property="og:image"]').first(),
  ).toHaveAttribute("content", "https://klyx.fr/en/tarifs/opengraph-image");
});

test("OpenGraph images render in both locales without redirect", async ({
  request,
}) => {
  for (const path of [
    "/fr/opengraph-image",
    "/en/opengraph-image",
    "/fr/tarifs/opengraph-image",
    "/en/services/agents-ia/opengraph-image",
    "/fr/services/geo-referencement-ia/opengraph-image",
    "/fr/blog/opengraph-image",
    "/en/blog/cout-agent-ia-pme/opengraph-image",
    "/fr/blog/etre-cite-par-chatgpt-perplexity/opengraph-image",
  ]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
    const png = Buffer.from(await response.body());
    expect(png.readUInt32BE(16), `${path} width`).toBe(1200);
    expect(png.readUInt32BE(20), `${path} height`).toBe(630);
  }
});

test("OpenGraph images and llms.txt are prerendered at build time", async ({
  request,
}) => {
  for (const path of [
    "/llms.txt",
    "/fr/opengraph-image",
    "/en/tarifs/opengraph-image",
    "/fr/realisations/citeme/opengraph-image",
  ]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
    expect(response.headers()["x-nextjs-cache"], path).toBe("HIT");
  }
  const unknown = await request.get("/xx/opengraph-image", { maxRedirects: 0 });
  expect(unknown.status()).toBe(404);
});

test("home and offer pages embed JSON-LD", async ({ page }) => {
  await page.goto("/");
  const home = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(home.join()).toContain('"ProfessionalService"');
  expect(home.join()).toContain('"WebSite"');

  await page.goto("/services/agents-ia");
  const agents = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const joined = agents.join();
  expect(joined).toContain('"FAQPage"');
  expect(joined).toContain('"BreadcrumbList"');
  expect(joined).toContain('"price":4500');
});

const NEW_SERVICES = [
  { fr: "/services/audit-ia", en: "/en/services/ai-audit", price: 1500 },
  {
    fr: "/services/automatisation-ia",
    en: "/en/services/ai-automation",
    price: 2400,
  },
  {
    fr: "/services/geo-referencement-ia",
    en: "/en/services/ai-search-visibility",
    price: 1200,
  },
];

for (const service of NEW_SERVICES) {
  test(`${service.fr} declares Service JSON-LD and hreflang`, async ({
    page,
  }) => {
    for (const path of [service.fr, service.en]) {
      await page.goto(path);
      const jsonLd = (
        await page
          .locator('script[type="application/ld+json"]')
          .allTextContents()
      ).join();
      expect(jsonLd, path).toContain('"Service"');
      expect(jsonLd, path).toContain('"FAQPage"');
      expect(jsonLd, path).toContain(`"price":${service.price}`);
      await expect(
        page.locator('link[rel="alternate"][hreflang="fr"]'),
      ).toHaveAttribute("href", `https://klyx.fr${service.fr}`);
      await expect(
        page.locator('link[rel="alternate"][hreflang="en"]'),
      ).toHaveAttribute("href", `https://klyx.fr${service.en}`);
    }
  });
}

test("llms.txt and the sitemap list the new service pages", async ({
  request,
}) => {
  const llms = await (await request.get("/llms.txt")).text();
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const service of NEW_SERVICES) {
    expect(llms).toContain(`https://klyx.fr${service.fr}`);
    expect(sitemap).toContain(`https://klyx.fr${service.en}`);
  }
});

test("contact form is enabled and its honeypot is unreachable", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(
    page.getByRole("button", { name: "Envoyer la demande" }),
  ).toBeEnabled();
  await expect(page.locator("#contact-website")).not.toBeFocused();
  await expect(
    page.getByRole("textbox", { name: "Laissez ce champ vide" }),
  ).toHaveCount(0);
  await page.locator("#contact-message").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#contact-website")).not.toBeFocused();
});

for (const javaScriptEnabled of [false, true]) {
  test.describe(`language switcher on dynamic pages (JS ${javaScriptEnabled ? "on" : "off"})`, () => {
    test.use({ javaScriptEnabled });

    test("maps case study slugs between locales", async ({ page }) => {
      await page.goto("/en/work/citeme");
      await expect(
        page.locator('nav[aria-label="Language"] a[hreflang="fr"]').first(),
      ).toHaveAttribute("href", "/realisations/citeme");
      await expect(
        page.locator('nav[aria-label="Language"] a[hreflang="en"]').first(),
      ).toHaveAttribute("href", "/en/work/citeme");

      await page.goto("/realisations/citeme");
      await expect(
        page.locator('nav[aria-label="Language"] a[hreflang="en"]').first(),
      ).toHaveAttribute("href", "/en/work/citeme");
    });
  });
}

const USE_CASE_PAGES = [
  {
    fr: "/cas-usage",
    en: "/en/use-cases",
    types: ["BreadcrumbList"],
  },
  {
    fr: "/cas-usage/immobilier",
    en: "/en/use-cases/real-estate",
    types: ["Service", "FAQPage", "BreadcrumbList"],
    price: 1500,
  },
  {
    fr: "/cas-usage/agences",
    en: "/en/use-cases/agencies",
    types: ["Service", "FAQPage", "BreadcrumbList"],
    price: 900,
  },
  {
    fr: "/cas-usage/cabinets-services",
    en: "/en/use-cases/professional-services",
    types: ["Service", "FAQPage", "BreadcrumbList"],
    price: 2400,
  },
  { fr: "/faq", en: "/en/faq", types: ["FAQPage", "BreadcrumbList"] },
];

for (const useCase of USE_CASE_PAGES) {
  test(`${useCase.fr} declares hreflang and its JSON-LD types`, async ({
    page,
  }) => {
    for (const path of [useCase.fr, useCase.en]) {
      await page.goto(path);
      const jsonLd = (
        await page
          .locator('script[type="application/ld+json"]')
          .allTextContents()
      ).join();
      for (const type of useCase.types) {
        expect(jsonLd, `${path} ${type}`).toContain(`"@type":"${type}"`);
      }
      if (useCase.price) {
        expect(jsonLd, path).toContain(`"price":${useCase.price}`);
      }
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://klyx.fr${path}`,
      );
      await expect(
        page.locator('link[rel="alternate"][hreflang="fr"]'),
      ).toHaveAttribute("href", `https://klyx.fr${useCase.fr}`);
      await expect(
        page.locator('link[rel="alternate"][hreflang="en"]'),
      ).toHaveAttribute("href", `https://klyx.fr${useCase.en}`);
      await expect(
        page.locator('link[rel="alternate"][hreflang="x-default"]'),
      ).toHaveAttribute("href", `https://klyx.fr${useCase.fr}`);
    }
  });
}

test("/faq answers are anchored, open on click and link to their page", async ({
  page,
}) => {
  await page.goto("/faq#faq-page-roi");
  const roi = page.locator("details#faq-page-roi");
  await roi.locator("summary").click();
  await expect(roi).toHaveAttribute("open", "");
  await expect(roi.locator("p").first()).toBeVisible();
  await expect(page.locator("details#home-price a")).toHaveAttribute(
    "href",
    "/tarifs",
  );
  const questions = await page.locator("main details").count();
  const jsonLd = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).join();
  expect(jsonLd.match(/"@type":"Question"/g)?.length).toBe(questions);
});

test("sitemap and llms.txt list the use-case and faq pages", async ({
  request,
}) => {
  const llms = await (await request.get("/llms.txt")).text();
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const useCase of USE_CASE_PAGES) {
    expect(llms).toContain(`https://klyx.fr${useCase.fr}`);
    expect(sitemap).toContain(`https://klyx.fr${useCase.en}`);
  }
});

for (const path of ["/", "/agence-ia-bordeaux", "/en/pricing", "/blog"]) {
  test(`${path} declares the organization and website once`, async ({
    page,
  }) => {
    await page.goto(path);
    const nodes = await jsonLdNodes(page);
    const organizations = nodes.filter((node) => hasType(node, "Organization"));
    expect(organizations).toHaveLength(1);
    expect(organizations[0]).toMatchObject({
      "@id": "https://klyx.fr/#organization",
      description: site.description,
      sameAs: [site.socials.linkedinCompany, site.socials.instagram],
    });
    expect(nodes.filter((node) => hasType(node, "WebSite"))).toHaveLength(1);
  });
}

const PAGE_TYPES = [
  { path: "/a-propos", types: ["AboutPage", "Person"] },
  { path: "/en/about", types: ["AboutPage", "Person"] },
  { path: "/tarifs", types: ["OfferCatalog", "FAQPage"] },
  { path: "/realisations", types: ["CollectionPage"] },
  { path: "/en/work/citeme", types: ["CreativeWork", "BreadcrumbList"] },
  { path: "/blog", types: ["Blog"] },
  { path: "/contact", types: ["ContactPage"] },
  { path: "/blog/cout-agent-ia-pme", types: ["BlogPosting", "BreadcrumbList"] },
];

for (const { path, types } of PAGE_TYPES) {
  test(`${path} declares ${types.join(" and ")}`, async ({ page }) => {
    await page.goto(path);
    const nodes = await jsonLdNodes(page);
    for (const type of types) {
      expect(
        nodes.some((node) => hasType(node, type)),
        `${path} ${type}`,
      ).toBe(true);
    }
  });
}

test("/tarifs JSON-LD matches the visible prices and FAQ", async ({ page }) => {
  await page.goto("/tarifs");
  const jsonLd = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).join();
  const questions = await page.locator("main details").count();
  expect(questions).toBeGreaterThan(0);
  expect(jsonLd.match(/"@type":"Question"/g)?.length).toBe(questions);
  const table = await page.locator("main table").textContent();
  for (const price of [900, 2900, 4500, 700]) {
    expect(jsonLd).toContain(`"price":${price}`);
    expect(table).toContain(formatPrice(price, "fr"));
  }
});

test("blog posts use their own share image in JSON-LD", async ({ page }) => {
  await page.goto("/en/blog/cout-agent-ia-pme");
  const article = (await jsonLdNodes(page)).find((node) =>
    hasType(node, "BlogPosting"),
  );
  const ogImage = await page
    .locator('meta[property="og:image"]')
    .first()
    .getAttribute("content");
  expect(article?.image).toBe(ogImage);
  expect(article?.image).toBe(
    "https://klyx.fr/en/blog/cout-agent-ia-pme/opengraph-image",
  );
});

test("every sitemap entry carries a lastmod", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const entries = sitemap.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  expect(entries.length).toBeGreaterThan(0);
  for (const entry of entries) {
    expect(entry).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}/);
  }
});

test("the IndexNow key file is served at the root", async ({ request }) => {
  const keyFile = readdirSync("public").find((file) =>
    /^[0-9a-f]{32}\.txt$/.test(file),
  );
  expect(keyFile).toBeDefined();
  const response = await request.get(`/${keyFile}`);
  expect(response.status()).toBe(200);
  expect((await response.text()).trim()).toBe(keyFile?.replace(".txt", ""));
});
