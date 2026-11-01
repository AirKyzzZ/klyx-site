import { expect, test } from "@playwright/test";

import en from "../messages/en.json";
import fr from "../messages/fr.json";
import { verifyLighthouse } from "../src/lib/proof";
import lighthouseData from "../src/lib/proof/klyx-lighthouse.json";

const HOME_TABS = ["agents", "sites", "fde"] as const;
const agents = fr.liveSystem.scenarios.agents;

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
    await expect(h1).toContainText(fr.home.hero.title);
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      test(`shows the whole trace, the chip and the tab links at ${viewport.width}`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto("/");
        const stage = page.locator('[data-ls-stage="agents"]');
        await expect(stage.locator("[data-line]")).toHaveCount(
          Object.keys(agents.trace).length,
        );
        const fit = await stage.evaluate((el) => {
          const clip = el
            .querySelector(".ls-term-clip")!
            .getBoundingClientRect();
          return [...el.querySelectorAll<HTMLElement>("[data-line]")]
            .filter((line) => getComputedStyle(line).display !== "none")
            .map((line) => {
              const box = line.getBoundingClientRect();
              const text = line.querySelector<HTMLElement>(".ls-text")!;
              return {
                line: line.textContent,
                shown: line.dataset.shown,
                inside:
                  box.top >= clip.top - 0.5 &&
                  box.bottom <= clip.bottom + 0.5 &&
                  box.left >= clip.left - 0.5 &&
                  box.right <= clip.right + 0.5,
                truncated: text.scrollWidth > text.clientWidth,
              };
            });
        });
        expect(fit.length).toBeGreaterThanOrEqual(7);
        for (const row of fit) {
          expect(row, row.line ?? "").toMatchObject({
            shown: "true",
            inside: true,
            truncated: false,
          });
        }
        await expect(stage.locator("[data-chip]")).toHaveText(agents.chip);
        await expect(stage.locator("[data-chip]")).toBeVisible();
        for (const id of HOME_TABS) {
          const tab = page.getByRole("tab", { name: fr.liveSystem.tabs[id] });
          await expect(tab).toBeVisible();
          await expect(tab).toHaveAttribute("href", /\/.+/);
          await expect(tab).not.toHaveAttribute("tabindex", /.*/);
        }
        await expect(page.getByText(fr.liveSystem.caption)).toBeVisible();
      });
    }
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("runs no animation and keeps the final state", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(2000);
      expect(await page.evaluate(() => document.getAnimations().length)).toBe(
        0,
      );
      const stage = page.locator('[data-ls-stage="agents"]');
      await expect(stage.locator('[data-node="slack"]')).toHaveAttribute(
        "data-state",
        "done",
      );
      await expect(stage.locator("[data-chip]")).toHaveAttribute(
        "data-shown",
        "true",
      );
    });
  });

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    test(`playback and a tab click shift no layout at ${viewport.width}`, async ({
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
      await page.locator("[data-live-system]").scrollIntoViewIfNeeded();
      await page.waitForTimeout(6000);
      await page.getByRole("tab", { name: fr.liveSystem.tabs.sites }).click();
      await page.waitForTimeout(1500);
      const cls = await page.evaluate(
        () => (window as Window & { __cls?: number }).__cls ?? 0,
      );
      expect(cls).toBeLessThan(0.02);
    });
  }

  test("a tab click swaps the selected tab and the graph", async ({ page }) => {
    await page.goto("/en");
    const sitesTab = page.getByRole("tab", { name: en.liveSystem.tabs.sites });
    await expect(sitesTab).toHaveAttribute("aria-selected", "false");
    await sitesTab.click();
    await expect(sitesTab).toHaveAttribute("aria-selected", "true");
    await expect(
      page.getByRole("tab", { name: en.liveSystem.tabs.agents }),
    ).toHaveAttribute("aria-selected", "false");
    await expect(page).toHaveURL(/\/en$/);
    const sites = page.locator('[data-ls-stage="sites"]');
    await expect(sites).toBeVisible();
    await expect(
      sites.getByText(en.liveSystem.scenarios.sites.nodes.lighthouse, {
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator('[data-ls-stage="agents"]')).toBeHidden();
  });

  test("the Sites tab shows a Lighthouse score only from a live klyx.fr run", async ({
    page,
  }) => {
    await page.goto("/en");
    await page.getByRole("tab", { name: en.liveSystem.tabs.sites }).click();
    const sites = page.locator('[data-ls-stage="sites"]');
    const measuredCaption = page.getByText(
      /^Real mobile Lighthouse score of klyx\.fr, measured on /,
    );
    const live = verifyLighthouse(lighthouseData);
    if (live?.kind === "lighthouse") {
      await expect(sites.locator("[data-chip]")).toHaveText(
        `Lighthouse ${live.scores.performance} · klyx.fr`,
      );
      await expect(measuredCaption).toBeVisible();
      await expect(page.getByText(en.liveSystem.caption)).toBeHidden();
      return;
    }
    await expect(sites.locator("[data-chip]")).toHaveCount(0);
    await expect(measuredCaption).toHaveCount(0);
    await expect(page.getByText(en.liveSystem.caption)).toBeVisible();
  });

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
      await page.waitForLoadState("load");
      await page.waitForTimeout(2500);
      expect(
        await page.evaluate(
          () => (window as Window & { __lcp?: string }).__lcp,
        ),
      ).toBe("h1");
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
