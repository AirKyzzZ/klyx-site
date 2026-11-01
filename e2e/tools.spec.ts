import { expect, type Page, test } from "@playwright/test";

import en from "../messages/en.json";
import fr from "../messages/fr.json";
import {
  CONNECTED_TOOLS,
  DEPLOYED_TECH,
  TOOLS,
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
  expect(logos.length).toBeGreaterThan(0);
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
  test(`${path} hero logos are decorative and named in text`, async ({
    page,
  }) => {
    await page.goto(path);
    const nodes = await page.locator(".ls-node[data-tool]").evaluateAll((els) =>
      els.map((el) => ({
        tool: el.getAttribute("data-tool"),
        text: el.querySelector(".ls-node-text")?.textContent ?? "",
        iconHidden: el
          .querySelector(".ls-node-icon")
          ?.getAttribute("aria-hidden"),
        logoHidden: el
          .querySelector("[data-logo]")
          ?.getAttribute("aria-hidden"),
      })),
    );
    expect(nodes.length).toBeGreaterThan(0);
    for (const node of nodes) {
      const tool = Object.values(TOOLS).find(
        (candidate) => "logo" in candidate && candidate.logo === node.tool,
      );
      expect(node.text, node.tool ?? "").toContain(tool?.name);
      expect(node).toMatchObject({ iconHidden: "true", logoHidden: "true" });
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
