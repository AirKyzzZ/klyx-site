import { expect, type Page, test } from "@playwright/test";

const POSTHOG_HOST = /posthog\.com$/;

test.use({ viewport: { width: 1440, height: 900 } });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__klyxEvents = [];
  });
});

function events(page: Page) {
  return page.evaluate(() => window.__klyxEvents ?? []);
}

async function waitForRuntime(page: Page) {
  await expect(page.locator("[data-track-seen]").first()).toBeAttached({
    timeout: 10_000,
  });
}

test("without a key, analytics makes no request and stores nothing", async ({
  page,
  context,
}) => {
  const posthogRequests: string[] = [];
  page.on("request", (request) => {
    if (POSTHOG_HOST.test(new URL(request.url()).hostname)) {
      posthogRequests.push(request.url());
    }
  });

  await page.goto("/services/agents-ia");
  await waitForRuntime(page);
  await page.locator("[data-track-view]").first().scrollIntoViewIfNeeded();
  await page
    .locator("header")
    .locator('[data-track="cta_book_call_click"]')
    .first()
    .click();
  await page.waitForLoadState("networkidle");

  expect(posthogRequests).toEqual([]);
  const cookies = (await context.cookies()).map((cookie) => cookie.name);
  expect(cookies.filter((name) => name !== "NEXT_LOCALE")).toEqual([]);
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
  await expect(page.locator('script[src*="posthog"]')).toHaveCount(0);
});

test("CTA clicks and the offer price ledger reach the tracker", async ({
  page,
}) => {
  await page.goto("/services/agents-ia");
  await waitForRuntime(page);

  await page.locator("[data-track-view]").first().scrollIntoViewIfNeeded();
  await expect
    .poll(() => events(page))
    .toContainEqual(["pricing_view", { location: "offer_page" }]);

  await page
    .locator('main [data-track="cta_quote_click"]')
    .first()
    .click({ modifiers: ["ControlOrMeta"] });
  await page
    .locator("header")
    .locator('[data-track="cta_book_call_click"]')
    .first()
    .click();

  await expect
    .poll(() => events(page))
    .toEqual(
      expect.arrayContaining([
        ["$pageview", undefined],
        ["cta_quote_click", { location: "offer_page" }],
        ["cta_book_call_click", { location: "header" }],
      ]),
    );
});

test("client-side navigation to pricing sends a pageview and pricing_view", async ({
  page,
}) => {
  await page.goto("/en");
  await expect
    .poll(() => events(page))
    .toContainEqual(["$pageview", undefined]);

  await page.evaluate(() => {
    window.__klyxEvents = [];
  });
  await page
    .getByRole("link", { name: "Pricing", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/en\/pricing$/);

  await expect
    .poll(() => events(page))
    .toEqual([
      ["$pageview", undefined],
      ["pricing_view", { location: "pricing_page" }],
    ]);
});

test("contact_submit carries the status only, never the form content", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.locator("#contact-form form").evaluate((form) => {
    if (!(form instanceof HTMLFormElement)) throw new Error("no form");
    const name = form.elements.namedItem("name");
    if (name instanceof HTMLInputElement) name.value = "Jane Test";
    form.noValidate = true;
    form.requestSubmit();
  });

  await expect
    .poll(() => events(page))
    .toContainEqual(["contact_submit", { status: "error" }]);
  const submits = (await events(page)).filter(
    ([event]) => event === "contact_submit",
  );
  expect(JSON.stringify(submits)).not.toContain("Jane");
});
