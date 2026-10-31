import { mkdirSync } from "node:fs";

import { test } from "@playwright/test";

import { routePaths } from "./route-paths";

const OUTPUT_DIR = "docs/screenshots/redesign";
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];

const requested = process.env.SCREENSHOT_ROUTES?.split(",").map((route) =>
  route.trim(),
);
const routes = requested ?? routePaths;

function fileStem(path: string) {
  return path === "/" ? "home" : path.slice(1).replaceAll("/", "-");
}

test.describe("redesign screenshots", () => {
  test.skip(process.env.SCREENSHOTS !== "1", "set SCREENSHOTS=1 to capture");
  test.use({ reducedMotion: "reduce" });

  test.beforeAll(() => {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  });

  for (const route of routes) {
    for (const viewport of VIEWPORTS) {
      test(`${route} at ${viewport.width}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(route);
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          scrollTo(0, 0);
        });
        await page.waitForLoadState("networkidle");
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path: `${OUTPUT_DIR}/${fileStem(route)}-${viewport.width}.png`,
          fullPage: true,
          animations: "disabled",
        });
      });
    }
  }
});

const MACHINE_ROUTES = ["/", "/services/agents-ia"];

test.describe("machine view screenshots", () => {
  test.skip(process.env.SCREENSHOTS !== "1", "set SCREENSHOTS=1 to capture");
  test.use({ reducedMotion: "reduce" });

  for (const route of MACHINE_ROUTES) {
    for (const viewport of VIEWPORTS) {
      test(`${route} machine view at ${viewport.width}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`${route}#machine`);
        await page.locator(".mv-line").first().waitFor();
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path: `${OUTPUT_DIR}/machine-${fileStem(route)}-${viewport.width}.png`,
          animations: "disabled",
        });
      });
    }
  }
});

test.describe("home section screenshots", () => {
  test.skip(process.env.SCREENSHOTS !== "1", "set SCREENSHOTS=1 to capture");
  test.use({ reducedMotion: "reduce" });

  for (const viewport of VIEWPORTS) {
    test(`home sections at ${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.addStyleTag({
        content: "header, .view-toggle { visibility: hidden !important; }",
      });
      await page.evaluate(() => document.fonts.ready);
      const sections = page.locator("main > section");
      const count = await sections.count();
      for (let i = 1; i < count; i++) {
        const section = sections.nth(i);
        await section.scrollIntoViewIfNeeded();
        const label = section.locator("p.type-label").first();
        const name =
          (await label.count()) > 0 ? await label.innerText() : "final-cta";
        const slug = name
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{M}/gu, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        await section.screenshot({
          path: `${OUTPUT_DIR}/home-section-${slug}-${viewport.width}.png`,
          animations: "disabled",
        });
      }
    });
  }
});
