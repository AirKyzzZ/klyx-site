import { expect, test } from "@playwright/test";

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
  ).toHaveAttribute("content", "https://klyx.fr/en/opengraph-image");
});

test("OpenGraph images render in both locales without redirect", async ({
  request,
}) => {
  for (const path of ["/fr/opengraph-image", "/en/opengraph-image"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
  }
});

test("home and offer pages embed JSON-LD", async ({ page }) => {
  await page.goto("/");
  const home = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(home.join()).toContain('"ProfessionalService"');

  await page.goto("/services/agents-ia");
  const agents = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const joined = agents.join();
  expect(joined).toContain('"FAQPage"');
  expect(joined).toContain('"BreadcrumbList"');
  expect(joined).toContain('"price":4500');
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
