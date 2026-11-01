import { expect, type Page, test } from "@playwright/test";

import en from "../messages/en.json";
import fr from "../messages/fr.json";
import {
  AI_MODEL_LOGOS,
  CONNECTED_TOOLS,
  DEPLOYED_TECH,
  type ToolGroup,
} from "../src/lib/tools";

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];

const names = (groups: ToolGroup[]) =>
  groups.flatMap((group) => group.tools.map((tool) => tool.name));

async function expectStrip(
  page: Page,
  expected: string[],
  label: string,
  note: string,
) {
  const strip = page.locator("[data-tools]");
  await strip.scrollIntoViewIfNeeded();
  await expect(strip.getByRole("heading", { name: label })).toBeVisible();
  await expect(strip.getByText(note)).toBeVisible();
  const chips = strip.locator("li[data-tool]");
  await expect(chips).toHaveCount(expected.length);
  for (const name of expected) {
    await expect(chips.filter({ hasText: name }).first()).toBeVisible();
  }
  const logos = await strip.locator("[data-logo]").evaluateAll((els) =>
    els.map((el) => {
      const tile = el.closest<HTMLElement>("li[data-tool]");
      const box = el.getBoundingClientRect();
      return {
        logo: el.getAttribute("data-logo"),
        hidden: el.getAttribute("aria-hidden"),
        size: [Math.round(box.width), Math.round(box.height)],
        named:
          !!tile?.dataset.tool &&
          (tile.textContent ?? "").includes(tile.dataset.tool),
      };
    }),
  );
  expect(logos).toHaveLength(expected.length);
  for (const logo of logos) {
    expect(logo, logo.logo ?? "").toMatchObject({
      hidden: "true",
      size: [24, 24],
      named: true,
    });
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

test.use({ reducedMotion: "reduce" });

for (const viewport of VIEWPORTS) {
  for (const [path, messages] of [
    ["/", fr],
    ["/en", en],
  ] as const) {
    test(`${path} tool grid names every tool at ${viewport.width}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      await expectStrip(
        page,
        names(CONNECTED_TOOLS),
        messages.home.tools.label,
        messages.home.tools.note,
      );
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
      await expectStrip(
        page,
        names(DEPLOYED_TECH),
        messages.offerPage.stack.label,
        messages.offerPage.stack.note,
      );
    });
  }
}

test("offer pages outside agents and automation carry no stack strip", async ({
  page,
}) => {
  await page.goto("/services/creation-site-web");
  await expect(page.locator("[data-tools]")).toHaveCount(0);
});

for (const path of ["/", "/services/automatisation-ia"]) {
  test(`${path} hero logos are decorative and the AI step shows the model marks`, async ({
    page,
  }) => {
    await page.goto(path);
    const nodes = await page
      .locator(".ls-node:is([data-tool], [data-models])")
      .evaluateAll((els) =>
        els.map((el) => ({
          text: el.querySelector(".ls-node-text")?.textContent ?? "",
          models: el.hasAttribute("data-models"),
          iconHidden: el
            .querySelector(".ls-node-icon")
            ?.getAttribute("aria-hidden"),
          logos: [...el.querySelectorAll("[data-logo]")].map((logo) =>
            logo.getAttribute("data-logo"),
          ),
        })),
      );
    expect(nodes.some((node) => node.models)).toBe(true);
    for (const node of nodes) {
      expect(node.iconHidden, node.text).toBe("true");
      expect(node.text.trim(), node.text).not.toBe("");
      if (node.models) expect(node.logos).toEqual([...AI_MODEL_LOGOS]);
      else expect(node.logos).toHaveLength(1);
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
