import { expect, type Page, test } from "@playwright/test";

import en from "../messages/en.json";
import fr from "../messages/fr.json";
import { formatPrice, getOfferPrice } from "../src/lib/offers";

const SECTORS = [
  {
    fr: "/cas-usage/immobilier",
    en: "/en/use-cases/real-estate",
    key: "realEstate",
  },
  { fr: "/cas-usage/agences", en: "/en/use-cases/agencies", key: "agencies" },
  {
    fr: "/cas-usage/cabinets-services",
    en: "/en/use-cases/professional-services",
    key: "services",
  },
] as const;

const LOCAL_CASES = ["pkba", "vertiflow", "lady-gallery", "hop-hop-immo"];
const ZONE = [
  "Mérignac",
  "Pessac",
  "Talence",
  "Bègles",
  "Bassin d'Arcachon",
  "Gironde",
];

async function jsonLd(page: Page) {
  return (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).join();
}

for (const sector of SECTORS) {
  test(`${sector.fr} shows problems, tasks, prices and no eyebrow`, async ({
    page,
  }) => {
    for (const [path, messages] of [
      [sector.fr, fr],
      [sector.en, en],
    ] as const) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveText(
        messages.useCases[sector.key].hero.title,
      );
      await expect(page.locator("[data-comparison-list] > li")).toHaveCount(4);
      await expect(page.locator("[data-use-case]")).toHaveCount(4);
      await expect(page.locator("[data-use-case] [data-flow-row]")).toHaveCount(
        4,
      );
      await expect(page.locator("[data-offer-card]")).toHaveCount(3);
      await expect(page.locator("[data-method-steps] > li")).toHaveCount(4);
      await expect(page.locator("main .type-label")).toHaveCount(0);
    }
  });
}

test("/cas-usage links every sector page with its starting price", async ({
  page,
}) => {
  await page.goto("/cas-usage");
  const cards = page.locator("[data-sector-card]");
  await expect(cards).toHaveCount(3);
  for (const sector of SECTORS) {
    await expect(
      page.locator(`[data-sector-card][href="${sector.fr}"]`),
    ).toHaveCount(1);
  }
  await expect(cards.first()).toContainText(
    formatPrice(getOfferPrice("audit-ia"), "fr"),
  );
  await expect(page.locator("[data-use-case]")).toHaveCount(4);
});

test("/agence-ia-bordeaux owns agence IA Bordeaux and consultant IA Bordeaux", async ({
  page,
}) => {
  await page.goto("/agence-ia-bordeaux");
  await expect(page.locator("h1")).toContainText("Agence IA à Bordeaux");
  await expect(
    page.locator("h2", { hasText: "Consultant IA à Bordeaux" }),
  ).toHaveCount(1);
  await expect(
    page.locator("details.faq-item summary", {
      hasText: "consultant IA à Bordeaux",
    }),
  ).toHaveCount(1);

  const zone = page.locator("[data-zone]");
  for (const place of ZONE) await expect(zone).toContainText(place);
  await expect(zone).toContainText("Partout en France");

  for (const slug of LOCAL_CASES) {
    await expect(
      page.locator(`main a[href="/realisations/${slug}"]`),
    ).toHaveCount(1);
  }
  await expect(
    page.locator('main a[href="/blog/integrer-ia-pme-methode"]'),
  ).toHaveCount(1);

  const data = await jsonLd(page);
  for (const type of ["Service", "FAQPage", "BreadcrumbList"]) {
    expect(data).toContain(`"@type":"${type}"`);
  }
  expect(data).toContain(`"minPrice":${getOfferPrice("audit-ia")}`);
  const questions = await page.locator("details.faq-item").count();
  expect(data.match(/"@type":"Question"/g)?.length).toBe(questions);
});

test("/en/ai-agency-bordeaux mirrors the local page in English", async ({
  page,
}) => {
  await page.goto("/en/ai-agency-bordeaux");
  await expect(page.locator("h1")).toContainText("AI agency in Bordeaux");
  await expect(
    page.locator("h2", { hasText: "AI consultant in Bordeaux" }),
  ).toHaveCount(1);
  for (const slug of LOCAL_CASES) {
    await expect(page.locator(`main a[href="/en/work/${slug}"]`)).toHaveCount(
      1,
    );
  }
});
