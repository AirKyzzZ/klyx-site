import { expect, test } from "@playwright/test";

import { NOT_FOUND_PATH, routePaths } from "./route-paths";

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

for (const path of ["/category/actualites/", "/author/maxime/"]) {
  test(`old ${path} ends up on /`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(new URL(response.url()).pathname).toBe("/");
  });
}

test("old /feed redirects to /blog/rss.xml", async ({ request }) => {
  const response = await request.get("/feed", { maxRedirects: 0 });
  expect([301, 308]).toContain(response.status());
  expect(new URL(response.headers().location, "http://x").pathname).toBe(
    "/blog/rss.xml",
  );
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
  expect(headers["strict-transport-security"]).toMatch(/^max-age=31536000/);
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toBe(
    "camera=(), microphone=(), geolocation=()",
  );
  expect(headers["x-powered-by"]).toBeUndefined();
});

test.describe("an unknown path without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("renders the French 404 with home, contact and English links", async ({
    page,
  }) => {
    const response = await page.goto(NOT_FOUND_PATH);
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1:visible")).toHaveText("Page introuvable");
    await expect(page.locator("main a[href='/']:visible")).toHaveCount(1);
    await expect(page.locator("main a[href='/contact']:visible")).toHaveCount(
      1,
    );
    await expect(page.locator("main a[href='/en']:visible")).toHaveCount(1);
  });
});

test("an unknown /en path renders the English 404 only", async ({ page }) => {
  const response = await page.goto("/en/page-not-here");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1:visible")).toHaveText("Page not found");
  await expect(page.locator("main a[href='/en/contact']:visible")).toHaveCount(
    1,
  );
  await expect(page.locator("h1")).toHaveCount(1);
});

test("an unknown case study renders the localized 404 page", async ({
  page,
}) => {
  const response = await page.goto("/en/work/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Page not found");
  await expect(page.locator("main a[href='/en/contact']")).toHaveCount(1);
});

test("/tarifs ledger cells never clip at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/tarifs");
  const clipped = await page
    .locator("main table")
    .first()
    .locator("tbody th, tbody td")
    .evaluateAll((cells) =>
      cells
        .filter((cell) => cell.scrollWidth > cell.clientWidth)
        .map((cell) => cell.textContent),
    );
  expect(clipped).toEqual([]);
});

for (const path of [...routePaths, NOT_FOUND_PATH]) {
  test(`${path} has no horizontal overflow at 390px`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(390);
  });
}

const NO_LIVE_LINK_CASES = [
  { path: "/realisations/kenzi", host: "kenzievents.com", status: null },
  { path: "/en/work/kenzi", host: "kenzievents.com", status: null },
  { path: "/realisations/reciproq", host: "reciproq.com", status: null },
  { path: "/en/work/reciproq", host: "reciproq.com", status: null },
  { path: "/realisations/cronolyss", host: "vercel.app", status: null },
  { path: "/en/work/cronolyss", host: "vercel.app", status: null },
  {
    path: "/realisations/crealogique",
    host: "crealogique.fr",
    status: "En cours de développement",
  },
  { path: "/en/work/crealogique", host: "crealogique.fr", status: "In development" },
];

for (const { path, host, status } of NO_LIVE_LINK_CASES) {
  test(`${path} renders without a live link`, async ({ page, request }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator(`a[href*="${host}"]`)).toHaveCount(0);
    if (status) {
      await expect(page.getByText(status).first()).toBeVisible();
    }
    const locale = path.startsWith("/en") ? "" : "/fr";
    const markdown = await request.get(`/md${locale}${path}`);
    expect(markdown.status()).toBe(200);
    expect(await markdown.text()).not.toContain(host);
  });
}

test("the case index labels Créalogique as in development", async ({ page }) => {
  await page.goto("/realisations");
  const card = page.locator('a[href*="/crealogique"]').last();
  await expect(card).toContainText("En cours de développement");
  await expect(page.locator('a[href*="/kenzi"]').first()).toBeVisible();
});
