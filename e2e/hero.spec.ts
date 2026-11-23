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
    const clients = page.locator("[data-home-hero] [data-clients]");
    for (const client of HOME_CLIENTS) {
      await expect(
        clients.getByRole("link", { name: client.name, exact: true }),
      ).toHaveAttribute("href", `/en/work/${client.slug}`);
    }
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      test(`shows the subtitle, both CTAs and the client logos at ${viewport.width}`, async ({
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
        const clients = hero.locator("[data-clients]");
        await expect(clients.getByRole("link")).toHaveCount(
          HOME_CLIENTS.length,
        );
        for (const client of HOME_CLIENTS) {
          const link = clients.getByRole("link", {
            name: client.name,
            exact: true,
          });
          await expect(link).toHaveAttribute(
            "href",
            `/realisations/${client.slug}`,
          );
          const mark = link.locator(".client-logo-mark");
          await expect(mark).toBeVisible();
          const box = await mark.boundingBox();
          expect(box!.height, client.name).toBeGreaterThanOrEqual(16);
          expect(box!.width / box!.height, client.name).toBeCloseTo(
            client.ratio,
            1,
          );
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

  test("the intro leaves the h1 alone and settles within 1.4 s", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const intro = await page.evaluate(() => {
      const seconds = (value: string) => Number.parseFloat(value) * 1000;
      return [...document.querySelectorAll("*")].flatMap((el) =>
        [null, "::after"].flatMap((pseudo) => {
          const style = getComputedStyle(el, pseudo);
          const names = style.animationName.split(", ");
          const durations = style.animationDuration.split(", ");
          const delays = style.animationDelay.split(", ");
          return names.flatMap((name, i) =>
            name.startsWith("intro-")
              ? [
                  {
                    name,
                    end:
                      seconds(delays[i % delays.length]) +
                      seconds(durations[i % durations.length]),
                    inH1: el.closest("h1") !== null,
                  },
                ]
              : [],
          );
        }),
      );
    });
    expect(new Set(intro.map((item) => item.name))).toEqual(
      new Set([
        "intro-fade",
        "intro-lift",
        "intro-rise",
        "intro-tile",
        "intro-wire",
        "intro-ignite",
        "intro-ring",
        "intro-settle",
        "intro-drop",
      ]),
    );
    expect(intro.filter((item) => item.inH1)).toEqual([]);
    expect(Math.max(...intro.map((item) => item.end))).toBeLessThanOrEqual(
      1400,
    );
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
            (PerformanceEntry & { element?: Element | null }) | undefined;
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
      for (const name of [fr.home.hero.ctaPrimary, fr.home.hero.ctaSecondary]) {
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
