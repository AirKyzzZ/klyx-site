import { expect, type Page, test } from "@playwright/test";

import fr from "../messages/fr.json";
import { THEME_COLORS, THEME_STORAGE_KEY } from "../src/lib/theme";

const theme = (page: Page) =>
  page.evaluate(() => document.documentElement.dataset.theme);

const themeColor = (page: Page) =>
  page.locator('meta[name="theme-color"]').getAttribute("content");

async function storeTheme(page: Page, value: string) {
  await page.addInitScript(
    ([key, stored]) => {
      if (!sessionStorage.getItem("seeded")) {
        localStorage.setItem(key, stored);
        sessionStorage.setItem("seeded", "1");
      }
    },
    [THEME_STORAGE_KEY, value],
  );
}

test("the server HTML ships the light theme before any script runs", async ({
  request,
}) => {
  for (const path of ["/", "/en/pricing", "/pour/agences"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).toMatch(/<html[^>]*data-theme="light"/);
    expect(html, path).toContain(THEME_STORAGE_KEY);
  }
});

test("the default theme is light, even when the system prefers dark", async ({
  browser,
}) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  const page = await context.newPage();
  await page.goto("/");
  expect(await theme(page)).toBe("light");
  expect(await themeColor(page)).toBe(THEME_COLORS.light);
  const background = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(background).toBe("rgb(251, 250, 248)");
  await context.close();
});

test("a stored dark theme applies before hydration", async ({ page }) => {
  await storeTheme(page, "dark");
  await page.route(/\/_next\/static\/chunks\/.*\.js/, (route) => route.abort());
  await page.goto("/");
  expect(await theme(page)).toBe("dark");
  expect(await themeColor(page)).toBe(THEME_COLORS.dark);
  const background = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(background).toBe("rgb(20, 20, 20)");
});

test("the switch persists across reload and client navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const group = page.getByRole("group", { name: fr.nav.theme.label }).first();
  const dark = group.getByRole("button", { name: fr.nav.theme.dark });
  await expect(dark).toHaveAttribute("aria-pressed", "false");
  await dark.click();
  await expect(dark).toHaveAttribute("aria-pressed", "true");
  expect(await theme(page)).toBe("dark");
  expect(await themeColor(page)).toBe(THEME_COLORS.dark);
  expect(
    await page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY),
  ).toBe("dark");

  await page.reload();
  expect(await theme(page)).toBe("dark");
  await expect(
    page
      .getByRole("group", { name: fr.nav.theme.label })
      .first()
      .getByRole("button", { name: fr.nav.theme.dark }),
  ).toHaveAttribute("aria-pressed", "true");

  await page
    .locator("header")
    .getByRole("link", { name: fr.nav.pricing, exact: true })
    .click();
  await expect(page).toHaveURL(/\/tarifs$/);
  expect(await theme(page)).toBe("dark");

  await page
    .getByRole("group", { name: fr.nav.theme.label })
    .first()
    .getByRole("button", { name: fr.nav.theme.light })
    .click();
  expect(await theme(page)).toBe("light");
  await page.reload();
  expect(await theme(page)).toBe("light");
});

test("the switch lives in the mobile menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: fr.nav.openMenu }).click();
  const menu = page.locator("#site-mobile-menu");
  await menu.getByRole("button", { name: fr.nav.theme.dark }).click();
  expect(await theme(page)).toBe("dark");
});

for (const value of ["light", "dark"] as const) {
  for (const width of [390, 768, 1440]) {
    test.describe(`home in ${value} at ${width}`, () => {
      test.use({ viewport: { width, height: width < 768 ? 844 : 900 } });

      test("no layout shift and no horizontal overflow", async ({ page }) => {
        await storeTheme(page, value);
        await page.addInitScript(() => {
          const win = window as Window & { __cls?: number };
          win.__cls = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const shift = entry as PerformanceEntry & {
                value: number;
                hadRecentInput: boolean;
              };
              if (!shift.hadRecentInput) win.__cls! += shift.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
        });
        await page.goto("/");
        expect(await theme(page)).toBe(value);
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
          const step = Math.round(innerHeight * 0.6);
          for (
            let y = 0;
            y < document.documentElement.scrollHeight;
            y += step
          ) {
            scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 60));
          }
        });
        const report = await page.evaluate(() => ({
          cls: (window as Window & { __cls?: number }).__cls ?? 0,
          scrollWidth: document.documentElement.scrollWidth,
        }));
        expect(report.cls, "CLS").toBeLessThan(0.02);
        expect(report.scrollWidth, "overflow").toBeLessThanOrEqual(width);
      });

      test.describe("with reduced motion", () => {
        test.use({ reducedMotion: "reduce" });

        test("runs no animation", async ({ page }) => {
          await storeTheme(page, value);
          await page.goto("/");
          await page.waitForLoadState("load");
          expect(await page.evaluate(() => document.getAnimations().length)).toBe(
            0,
          );
        });
      });
    });
  }
}
