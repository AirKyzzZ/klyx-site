import { expect, type Page, test } from "@playwright/test";

import { NOT_FOUND_PATH, pagePaths } from "./route-paths";

const WIDTHS = [390, 768, 1440];
const MAX_CLS = 0.02;
const HERO_LADDER_MS = 1800;
const PRICE = /\d\s?€|€\s?\d/;

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 300));
  });
}

function effectiveOpacity(el: Element) {
  let opacity = 1;
  for (let node: Element | null = el; node; node = node.parentElement) {
    opacity *= Number(getComputedStyle(node).opacity);
  }
  return opacity;
}

for (const route of pagePaths) {
  for (const width of WIDTHS) {
    test.describe(`${route} at ${width}`, () => {
      test.use({ viewport: { width, height: width < 768 ? 844 : 900 } });

      test("no layout shift, no overflow, one h1, every image has alt", async ({
        page,
      }) => {
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
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        await scrollThrough(page);
        const report = await page.evaluate(() => ({
          cls: (window as Window & { __cls?: number }).__cls ?? 0,
          scrollWidth: document.documentElement.scrollWidth,
          h1: document.querySelectorAll("h1").length,
          missingAlt: [...document.querySelectorAll("img:not([alt])")].map(
            (img) => img.getAttribute("src"),
          ),
        }));
        expect(report.cls, "CLS").toBeLessThan(MAX_CLS);
        expect(report.scrollWidth, "horizontal overflow").toBeLessThanOrEqual(
          width,
        );
        expect(report.h1, "h1 count").toBe(1);
        expect(report.missingAlt, "images without alt").toEqual([]);
      });

      test.describe("with reduced motion", () => {
        test.use({ reducedMotion: "reduce" });

        test("runs no animation", async ({ page }) => {
          await page.goto(route);
          await page.waitForLoadState("load");
          await scrollThrough(page);
          const running = await page.evaluate(() =>
            document.getAnimations().map((animation) => {
              const target = (animation.effect as KeyframeEffect | null)
                ?.target;
              return `${animation.constructor.name} on ${target?.tagName ?? "?"}.${target?.className ?? ""}`;
            }),
          );
          expect(running).toEqual([]);
        });
      });

      test.describe("without JavaScript", () => {
        test.use({ javaScriptEnabled: false });

        test("h1, prices and FAQ answers are visible", async ({ page }) => {
          test.fixme(
            route === NOT_FOUND_PATH,
            "Next renders notFound() with an empty body before hydration; needs experimental.globalNotFound (Maxime to approve)",
          );
          await page.goto(route);
          const h1 = page.locator("h1");
          await expect(h1).toBeVisible();
          expect(await h1.evaluate(effectiveOpacity)).toBe(1);

          await page.waitForTimeout(HERO_LADDER_MS);
          const priceCount = await page.evaluate((source) => {
            const price = new RegExp(source);
            const walker = document.createTreeWalker(
              document.querySelector("main") ?? document.body,
              NodeFilter.SHOW_TEXT,
            );
            const owners = new Set<Element>();
            for (let node = walker.nextNode(); node; node = walker.nextNode()) {
              const owner = node.parentElement;
              if (!owner || !price.test(node.textContent ?? "")) continue;
              if (owner.closest("details:not([open]), [hidden]")) continue;
              if (owner.getClientRects().length === 0) continue;
              owners.add(owner);
            }
            [...owners].forEach((owner, i) =>
              owner.setAttribute("data-qa-price", String(i)),
            );
            return owners.size;
          }, PRICE.source);
          for (let i = 0; i < priceCount; i++) {
            const price = page.locator(`[data-qa-price="${i}"]`);
            await price.evaluate((el) =>
              el.scrollIntoView({ block: "center" }),
            );
            await page.waitForTimeout(30);
            expect(
              await price.evaluate(effectiveOpacity),
              await price.innerText(),
            ).toBeGreaterThan(0.99);
          }

          const faqs = page.locator("details.faq-item");
          for (const item of await faqs.all()) {
            const answer = item.locator(":scope > p");
            if (!(await item.evaluate((el: HTMLDetailsElement) => el.open))) {
              await item.locator("summary").click();
            }
            await expect(answer).toBeVisible();
            await answer.evaluate((el) =>
              el.scrollIntoView({ block: "center" }),
            );
            await page.waitForTimeout(30);
            expect(await answer.evaluate(effectiveOpacity)).toBeGreaterThan(
              0.99,
            );
          }
        });
      });
    });
  }
}
