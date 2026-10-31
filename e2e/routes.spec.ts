import { expect, test } from "@playwright/test";

import { type Locale, routing } from "../src/i18n/routing";

const SAMPLE_SLUG = "hop-hop-immo";

function localize(locale: Locale, pathname: string, localized: string) {
  const path = localized.replace("[slug]", SAMPLE_SLUG);
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

const paths = routing.locales.flatMap((locale) =>
  Object.entries(routing.pathnames)
    .filter(([pathname]) => pathname !== "/blog/[slug]")
    .map(([pathname, value]) =>
      localize(
        locale,
        pathname,
        typeof value === "string" ? value : value[locale],
      ),
    ),
);

for (const path of paths) {
  test(`${path} renders with one h1`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  });
}

test("language switch on /en/pricing points to /tarifs", async ({ page }) => {
  await page.goto("/en/pricing");
  await expect(page.locator('a[hreflang="fr"]').first()).toHaveAttribute(
    "href",
    "/tarifs",
  );
});

test("unknown case study returns 404", async ({ request }) => {
  const response = await request.get("/realisations/does-not-exist");
  expect(response.status()).toBe(404);
});

test("unknown blog post returns 404", async ({ request }) => {
  const response = await request.get("/blog/does-not-exist");
  expect(response.status()).toBe(404);
});
