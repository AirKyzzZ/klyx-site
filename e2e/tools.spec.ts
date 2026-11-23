import { expect, test } from "@playwright/test";

import en from "../messages/en.json";
import fr from "../messages/fr.json";
import { HOME_TOOLS, OTHER_TOOL_COUNT } from "../src/lib/home-sections";
import { DEPLOYED_TECH, type ToolGroup } from "../src/lib/tools";

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];

const names = (groups: ToolGroup[]) =>
  groups.flatMap((group) => group.tools.map((tool) => tool.name));

test.use({ reducedMotion: "reduce" });

for (const viewport of VIEWPORTS) {
  for (const [path, messages] of [
    ["/", fr],
    ["/en", en],
  ] as const) {
    test(`${path} tools strip names each tool next to its decorative logo at ${viewport.width}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      const strip = page.locator("[data-tools-strip]");
      await strip.scrollIntoViewIfNeeded();
      await expect(
        strip.getByRole("heading", { name: messages.home.tools.title }),
      ).toBeVisible();
      const items = strip.locator("li[data-tool]");
      await expect(items).toHaveCount(HOME_TOOLS.length);
      for (const { name } of HOME_TOOLS) {
        await expect(items.filter({ hasText: name })).toBeVisible();
      }
      await expect(
        strip.getByText(
          messages.home.tools.more.replace("{count}", String(OTHER_TOOL_COUNT)),
        ),
      ).toBeVisible();
      const logos = await items
        .locator("[data-logo]")
        .evaluateAll((els) => els.map((el) => el.getAttribute("aria-hidden")));
      expect(logos).toEqual(HOME_TOOLS.map(() => "true"));
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  for (const [path, messages] of [
    ["/services/agents-ia", fr],
    ["/services/automatisation-ia", fr],
    ["/en/services/ai-agents", en],
    ["/en/services/ai-automation", en],
  ] as const) {
    test(`${path} lists the deployed stack at ${viewport.width}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      const strip = page.locator("[data-tools-strip]");
      await strip.scrollIntoViewIfNeeded();
      await expect(
        strip.getByRole("heading", { name: messages.offerPage.stack.label }),
      ).toBeVisible();
      await expect(page.getByText(messages.offerPage.stack.note)).toBeVisible();
      const items = strip.locator("li[data-tool]");
      await expect(items).toHaveCount(names(DEPLOYED_TECH).length);
      for (const name of names(DEPLOYED_TECH)) {
        await expect(items.filter({ hasText: name }).first()).toBeVisible();
      }
      const logos = await items
        .locator("[data-logo]")
        .evaluateAll((els) => els.map((el) => el.getAttribute("aria-hidden")));
      expect(logos).toEqual(names(DEPLOYED_TECH).map(() => "true"));
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

test("offer pages outside agents and automation carry no stack strip", async ({
  page,
}) => {
  await page.goto("/services/creation-site-web");
  await expect(page.locator("[data-tools-strip]")).toHaveCount(0);
});

for (const [path, messages] of [
  ["/services/automatisation-ia", fr],
  ["/en/services/ai-automation", en],
] as const) {
  test(`${path} use cases show decorative tool flows around the AI step`, async ({
    page,
  }) => {
    await page.goto(path);
    const cards = page.locator("[data-use-case]");
    await expect(cards).toHaveCount(3);
    for (const card of await cards.all()) {
      const flow = card.locator("[data-flow-row]");
      await expect(flow).toHaveCount(1);
      expect(
        await flow.evaluate(
          (el) => el.closest("[aria-hidden='true']") !== null,
        ),
      ).toBe(true);
      await expect(flow).toContainText(messages.automation.block.agent);
      expect(await flow.locator("[data-logo]").count()).toBeGreaterThanOrEqual(
        2,
      );
      await expect(card.locator("h3")).toBeVisible();
    }
  });
}

for (const [path, messages] of [
  ["/mentions-legales", fr],
  ["/en/legal-notice", en],
] as const) {
  test(`${path} credits the MCP logo under CC BY 4.0`, async ({ page }) => {
    await page.goto(path);
    const credits = page.locator("#credits");
    await expect(credits).toContainText(messages.legal.credits.trademarks);
    await expect(credits).toContainText(messages.legal.credits.items.mcp);
    await expect(
      credits.locator('a[href="https://creativecommons.org/licenses/by/4.0/"]'),
    ).toBeVisible();
  });
}
