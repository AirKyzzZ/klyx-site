import { expect, test } from "@playwright/test";

import en from "../messages/en.json";
import fr from "../messages/fr.json";
import { HOME_CLIENTS } from "../src/lib/home-sections";

test.describe("home hero", () => {
  test("h1 is visible at full opacity from first paint", async ({ page }) => {
    await page.goto("/", { waitUntil: "commit" });
    const h1 = page.locator("h1");
    await h1.waitFor();
    const style = await h1.evaluate((el) => ({
      opacity: getComputedStyle(el).opacity,
      transform: getComputedStyle(el).transform,
      animations: el.getAnimations().length,
    }));
    expect(style).toEqual({ opacity: "1", transform: "none", animations: 0 });
    await expect(h1).toHaveText(fr.home.hero.title);
  });

  test("the English home carries the English hero", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("h1")).toHaveText(en.home.hero.title);
    await expect(
      page
        .locator("main")
        .getByRole("link", { name: en.home.hero.ctaSecondary }),
    ).toHaveAttribute("href", "/en/work");
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      test(`shows the subtitle, both CTAs and the client names at ${viewport.width}`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto("/");
        const hero = page.locator("[data-home-hero]");
        await expect(hero.getByText(fr.home.hero.subtitle)).toBeVisible();
        for (const name of [
          fr.home.hero.ctaPrimary,
          fr.home.hero.ctaSecondary,
        ]) {
          await expect(hero.getByRole("link", { name })).toBeVisible();
        }
        for (const client of HOME_CLIENTS) {
          await expect(hero.getByText(client, { exact: true })).toBeVisible();
        }
        await expect(hero.getByText("CiteMe", { exact: true })).toHaveCount(0);
      });
    }
  });

  test("the constellation is decorative and shows real logos on desktop only", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const constellation = page.locator("[data-constellation]");
    await expect(constellation).toHaveAttribute("aria-hidden", "true");
    await expect(constellation.locator("[data-logo]")).toHaveCount(10);
    await expect(constellation.locator("[data-logo]").first()).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(constellation.locator("[data-logo]").first()).toBeHidden();
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("runs no animation, not even the rail light or the floating logos", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/");
      await page.waitForLoadState("load");
      await expect(page.locator(".view-toggle--floating")).toHaveAttribute(
        "role",
        "switch",
      );
      expect(await page.evaluate(() => document.getAnimations().length)).toBe(
        0,
      );
    });
  });

  test("the logos float, the dots pulse and the rail light runs", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const names = await page.evaluate(() =>
      document
        .getAnimations()
        .map((animation) => (animation as CSSAnimation).animationName),
    );
    expect(names).toEqual(
      expect.arrayContaining(["logo-float", "dot-pulse", "rail-light"]),
    );
  });

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    test(`loading the hero shifts no layout at ${viewport.width}`, async ({
      page,
    }) => {
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
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      const cls = await page.evaluate(
        () => (window as Window & { __cls?: number }).__cls ?? 0,
      );
      expect(cls).toBeLessThan(0.02);
    });
  }

  test.describe("on a phone", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("the h1 is the largest contentful paint", async ({ page }) => {
      await page.addInitScript(() => {
        const win = window as Window & { __lcp?: string };
        new PerformanceObserver((list) => {
          const last = list.getEntries().at(-1) as
            | (PerformanceEntry & { element?: Element | null })
            | undefined;
          win.__lcp = last?.element?.closest("h1")
            ? "h1"
            : (last?.element?.tagName ?? "none");
        }).observe({ type: "largest-contentful-paint", buffered: true });
      });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() =>
          page.evaluate(() => (window as Window & { __lcp?: string }).__lcp),
        )
        .toBe("h1");
    });

    test("h1 and both CTAs fit in the first screen", async ({ page }) => {
      await page.goto("/");
      for (const name of [
        fr.home.hero.ctaPrimary,
        fr.home.hero.ctaSecondary,
      ]) {
        const box = await page
          .locator("main")
          .getByRole("link", { name })
          .first()
          .boundingBox();
        expect(box).not.toBeNull();
        expect(box!.y + box!.height).toBeLessThanOrEqual(844);
      }
    });
  });
});
