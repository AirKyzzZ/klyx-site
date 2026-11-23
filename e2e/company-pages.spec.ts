import { readdirSync } from "node:fs";

import { expect, test } from "@playwright/test";

import en from "../messages/en.json";
import fr from "../messages/fr.json";

const caseSlugs = [
  ...new Set(
    readdirSync("content/realisations").map((file) => file.split(".")[0]),
  ),
];

test("/a-propos introduces the founder in plain cards, without terminal windows", async ({
  page,
}) => {
  await page.goto("/a-propos");
  const h1 = page.locator("h1");
  await expect(h1).toHaveText(fr.about.hero.title);
  await expect(h1).not.toContainText(/agence IA/i);

  const founder = page.locator("[data-founder-card]");
  await expect(founder).toBeVisible();
  await expect(founder.locator("svg[role='img']")).toHaveCount(1);
  for (const item of Object.values(fr.about.team.items)) {
    await expect(page.getByRole("heading", { name: item.title })).toBeVisible();
  }
  await expect(page.locator("main")).not.toContainText("team.yml");
  await expect(page.locator("main")).not.toContainText("klyx --info");
});

test("/en/work lists every case study as a card linking to it", async ({
  page,
}) => {
  await page.goto("/en/work");
  await expect(page.locator("h1")).toHaveText(en.cases.hero.title);
  const cards = page.locator("[data-case-card]");
  await expect(cards).toHaveCount(caseSlugs.length);
  for (const slug of caseSlugs) {
    await expect(
      page.locator(`[data-case-card][href="/en/work/${slug}"]`),
    ).toHaveCount(1);
  }
});

test("a case study shows clean screenshots, its facts and the next projects", async ({
  page,
}) => {
  await page.goto("/realisations/hop-hop-immo");
  const shots = page.locator("[data-shot='case-hero'] img");
  await expect(shots).toHaveCount(2);
  await expect(page.locator("[data-shot='case-hero'] svg")).toHaveCount(0);
  await expect(page.getByText(fr.cases.labels.noOutcome)).toBeVisible();
  await expect(page.locator("main [data-case-row]")).toHaveCount(3);
});

test("/faq groups every question under a theme heading", async ({ page }) => {
  await page.goto("/faq");
  for (const theme of Object.values(fr.faqPage.themes)) {
    await expect(
      page.getByRole("heading", { level: 2, name: theme }),
    ).toBeVisible();
  }
  await expect(page.locator("main details.faq-item[open]")).toHaveCount(
    Object.keys(fr.faqPage.themes).length,
  );
});
