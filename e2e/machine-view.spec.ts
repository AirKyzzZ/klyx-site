import { expect, type Page, test } from "@playwright/test";

import fr from "../messages/fr.json";
import { formatPrice } from "../src/lib/offers";
import { routePaths } from "./route-paths";

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const squash = (text: string) => text.replace(/\s+/g, " ").trim();

async function scrollPastHero(page: Page) {
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForFunction(() => window.scrollY > 0);
}

async function h1Text(page: Page) {
  return squash(await page.locator("main h1").first().innerText());
}

const CASES = [
  { route: "/", price: formatPrice(900, "fr"), md: "/md/fr" },
  {
    route: "/en/services/ai-agents",
    price: formatPrice(4500, "en"),
    md: "/md/en/services/ai-agents",
  },
];

for (const { route, price, md } of CASES) {
  test(`MACHINE on ${route} shows the page markdown`, async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(route);
    const h1 = await h1Text(page);
    const toggle = page.locator(".view-toggle--floating");
    await expect(toggle).toHaveAttribute("href", md);
    await expect(toggle).toHaveAttribute("role", "switch");
    await expect(toggle).toHaveAttribute("aria-checked", "false");

    await scrollPastHero(page);
    await toggle.click();
    const layer = page.locator(".machine-view");
    await expect(layer).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await expect(page).toHaveURL(/#machine$/);
    await expect(layer.locator(".mv-path")).toHaveText(md);
    await expect(layer.locator(".mv-line").first()).toContainText(`# ${h1}`);
    await expect(layer).toContainText(price);
    await expect(layer.locator(".mv-request")).toContainText(
      /KB · ≈[\d\s,]+ tokens/,
    );
  });
}

test("Esc returns to HUMAN and restores the scroll position", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/tarifs");
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForFunction(() => window.scrollY === 900);
  await page.locator(".view-toggle--floating").click();
  await expect(page.locator(".machine-view")).toBeVisible();
  await page.locator(".machine-view").evaluate((el) => el.scrollTo(0, 600));

  await page.keyboard.press("Escape");
  await expect(page.locator(".machine-view")).toBeHidden();
  await expect(page).not.toHaveURL(/#machine/);
  expect(await page.evaluate(() => window.scrollY)).toBe(900);
});

test("the switch is keyboard operable with Space", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/contact");
  const toggle = page.locator(".view-toggle--floating");
  await toggle.focus();
  await page.keyboard.press(" ");
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-checked", "false");
});

test("#machine in the URL opens the machine view", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/en/pricing#machine");
  await expect(page.locator(".machine-view")).toBeVisible();
  await expect(page.locator(".mv-path")).toHaveText("/md/en/pricing");
});

test("on mobile the toggle lives in the nav sheet and the footer", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  await expect(page.locator(".view-toggle--floating")).toBeHidden();
  await page.getByRole("button", { name: fr.nav.openMenu }).click();
  await expect(page.locator("#site-mobile-menu .view-toggle")).toBeVisible();
  await page.getByRole("button", { name: fr.nav.closeMenu }).click();
  await page.locator("footer .view-toggle").click();
  await expect(page.locator(".machine-view")).toBeVisible();
  await page.locator(".machine-view .mv-inline-toggle .view-toggle").click();
  await expect(page.locator(".machine-view")).toBeHidden();
});

test("switching from the nav sheet closes the sheet", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  await page.getByRole("button", { name: fr.nav.openMenu }).click();
  await page.locator("#site-mobile-menu .view-toggle").click();
  await expect(page.locator(".machine-view")).toBeVisible();
  await expect(page.locator("#site-mobile-menu")).toBeHidden();
});

test("hidden page content is inert while MACHINE is open", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  await scrollPastHero(page);
  await page.locator(".view-toggle--floating").click();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await expect(page.locator("body > div > footer")).toHaveAttribute(
    "inert",
    "",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("main")).not.toHaveAttribute("inert", /.*/);
});

test("the floating toggle stays out of the hero until the page scrolls", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const toggle = page.locator(".view-toggle--floating");
  await expect(toggle).toHaveCSS("opacity", "0");
  await scrollPastHero(page);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
  await expect(toggle).toHaveCSS("opacity", "1");
});

test("outside the home the floating toggle is usable without scrolling", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/blog");
  const toggle = page.locator(".view-toggle--floating");
  await expect(toggle).toHaveCSS("opacity", "1");
  await toggle.click();
  await expect(page.locator(".machine-view")).toBeVisible();
});

test("a modified click on the toggle is left to the browser", async ({
  page,
  context,
}) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  await scrollPastHero(page);
  const popup = context.waitForEvent("page");
  await page
    .locator(".view-toggle--floating")
    .click({ modifiers: ["ControlOrMeta"] });
  const opened = await popup;
  await opened.waitForURL(/\/md\/fr$/);
  expect(new URL(opened.url()).pathname).toBe("/md/fr");
  await expect(page.locator(".machine-view")).toBeHidden();
  await expect(page).not.toHaveURL(/#machine/);
});

for (const viewport of [DESKTOP, MOBILE]) {
  test(`toggling shifts no layout at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.addInitScript(() => {
      const win = window as Window & { __cls?: number };
      win.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          win.__cls! += (entry as PerformanceEntry & { value: number }).value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("/services/agents-ia");
    await page.waitForTimeout(1000);
    const before = await page.evaluate(
      () => (window as Window & { __cls?: number }).__cls ?? 0,
    );
    await page.evaluate(() => {
      window.location.hash = "machine";
    });
    await expect(page.locator(".mv-line").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".machine-view")).toBeHidden();
    await page.waitForTimeout(500);
    const after = await page.evaluate(
      () => (window as Window & { __cls?: number }).__cls ?? 0,
    );
    expect(after - before).toBeLessThan(0.02);
  });
}

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the toggle is a link to the markdown", async ({ page, request }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/en/services/ai-agents");
    const href = await page
      .locator(".view-toggle--floating")
      .getAttribute("href");
    expect(href).toBe("/md/en/services/ai-agents");
    const response = await request.get(href!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe(
      "text/markdown; charset=utf-8",
    );
  });
});

test("markdown alternates are noindex and absent from the sitemap", async ({
  request,
}) => {
  const markdown = await request.get("/md/fr/services/agents-ia");
  expect(markdown.status()).toBe(200);
  expect(markdown.headers()["x-robots-tag"]).toBe("noindex");
  expect((await request.get("/md/fr/nope")).status()).toBe(404);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/md/");
});

test("every page links a markdown alternate that starts with its h1", async ({
  page,
  request,
}) => {
  test.setTimeout(120_000);
  for (const route of routePaths) {
    await page.goto(route);
    const alternate = await page
      .locator('link[rel="alternate"][type="text/markdown"]')
      .getAttribute("href");
    expect(alternate, route).toMatch(/^https:\/\/klyx\.fr\/md\/(fr|en)/);
    const mdPath = new URL(alternate!).pathname;
    await expect(page.locator(".view-toggle--floating"), route).toHaveAttribute(
      "href",
      mdPath,
    );
    const markdown = await (await request.get(mdPath)).text();
    expect(markdown.split("\n")[0], route).toBe(`# ${await h1Text(page)}`);
  }
});
