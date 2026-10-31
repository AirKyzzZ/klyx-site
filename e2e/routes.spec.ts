import { expect, test } from "@playwright/test";

import { routePaths } from "./route-paths";

for (const path of routePaths) {
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

const LEAD_MAGNET = "/wp-content/uploads/2025/07/guide_vitrine_essentiels.pdf";

test("old /agence-web-bordeaux/ ends up on /", async ({ request }) => {
  const response = await request.get("/agence-web-bordeaux/");
  expect(response.status()).toBe(200);
  expect(new URL(response.url()).pathname).toBe("/");
});

test("old /feed redirects to /blog/rss.xml", async ({ request }) => {
  const response = await request.get("/feed", { maxRedirects: 0 });
  expect([301, 308]).toContain(response.status());
  expect(response.headers().location).toBe("/blog/rss.xml");
});

test("/?attachment_id=425 redirects to the lead magnet PDF", async ({
  request,
}) => {
  const response = await request.get("/?attachment_id=425", {
    maxRedirects: 0,
  });
  expect([301, 308]).toContain(response.status());
  expect(new URL(response.headers().location, "http://x").pathname).toBe(
    LEAD_MAGNET,
  );
});

test("lead magnet PDF is served as application/pdf", async ({ request }) => {
  const response = await request.get(LEAD_MAGNET);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

for (const path of [
  "/wp-login.php",
  "/xmlrpc.php",
  "/wp-admin/",
  "/wp-json/wp/v2/posts",
  "/wp-content/uploads/2020/01/other.jpg",
]) {
  test(`${path} returns 410`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(410);
  });
}

test("/blog/rss.xml is served unprefixed as RSS", async ({ request }) => {
  const response = await request.get("/blog/rss.xml", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("rss+xml");
});

test("responses carry the security headers", async ({ request }) => {
  const headers = (await request.get("/")).headers();
  expect(headers["strict-transport-security"]).toBe("max-age=31536000");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toBe(
    "camera=(), microphone=(), geolocation=()",
  );
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("home has no horizontal overflow at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(scrollWidth).toBeLessThanOrEqual(390);
});

for (const path of [
  "/services/creation-site-web",
  "/services/agents-ia",
  "/forward-deployed-engineer",
  "/services/audit-ia",
  "/services/automatisation-ia",
  "/services/geo-referencement-ia",
]) {
  test(`${path} has no horizontal overflow at 390px`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(390);
  });
}
