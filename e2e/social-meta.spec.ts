import { expect, type Page, test } from "@playwright/test";

import { NOT_FOUND_PATH, pagePaths } from "./route-paths";

const ORIGIN = "https://klyx.fr";
const ARTICLE = /^\/(en\/work|realisations|blog|en\/blog)\/[^/]+$/;

async function meta(page: Page, attr: "property" | "name", key: string) {
  return page.locator(`meta[${attr}="${key}"]`).first().getAttribute("content");
}

for (const path of pagePaths.filter((p) => p !== NOT_FOUND_PATH)) {
  test(`${path} has Open Graph, Twitter and icon tags`, async ({
    page,
    request,
  }) => {
    await page.goto(path);
    const en = path === "/en" || path.startsWith("/en/");
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    const title = await page.title();

    expect(await meta(page, "property", "og:title")).toBe(title);
    expect(await meta(page, "property", "og:description")).toBeTruthy();
    expect(await meta(page, "property", "og:url")).toBe(canonical);
    expect(await meta(page, "property", "og:site_name")).toBe("Klyx");
    expect(await meta(page, "property", "og:locale")).toBe(
      en ? "en_US" : "fr_FR",
    );
    expect(await meta(page, "property", "og:locale:alternate")).toBe(
      en ? "fr_FR" : "en_US",
    );
    expect(await meta(page, "property", "og:type")).toBe(
      ARTICLE.test(path) ? "article" : "website",
    );
    expect(await meta(page, "property", "og:image:width")).toBe("1200");
    expect(await meta(page, "property", "og:image:height")).toBe("630");
    expect(await meta(page, "name", "twitter:card")).toBe(
      "summary_large_image",
    );
    expect(await meta(page, "name", "twitter:title")).toBe(title);
    expect(await meta(page, "name", "twitter:description")).toBeTruthy();

    const image = await meta(page, "property", "og:image");
    expect(image?.startsWith(`${ORIGIN}/`), `${image}`).toBe(true);
    expect(await meta(page, "name", "twitter:image")).toBe(image);
    const response = await request.get(image!.slice(ORIGIN.length), {
      maxRedirects: 0,
    });
    expect(response.status(), image!).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
    const png = Buffer.from(await response.body());
    expect(png.readUInt32BE(16), `${image} width`).toBe(1200);
    expect(png.readUInt32BE(20), `${image} height`).toBe(630);

    await expect(
      page.locator('link[rel="icon"][type="image/svg+xml"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('link[rel="icon"][href^="/favicon.ico"]'),
    ).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      "/manifest.webmanifest",
    );
  });
}

test("favicon set and web manifest are served", async ({ request }) => {
  for (const [path, type] of [
    ["/favicon.ico", "image/x-icon"],
    ["/icon.svg", "image/svg+xml"],
    ["/apple-icon.png", "image/png"],
    ["/icon-192.png", "image/png"],
    ["/icon-512.png", "image/png"],
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toContain(type);
  }
  const svg = await (await request.get("/icon.svg")).text();
  expect(svg).toContain("prefers-color-scheme:dark");
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest).toMatchObject({
    name: "Klyx",
    short_name: "Klyx",
    theme_color: "#141414",
    background_color: "#141414",
    icons: [
      { src: "/icon-192.png", sizes: "192x192" },
      { src: "/icon-512.png", sizes: "512x512" },
    ],
  });
});
