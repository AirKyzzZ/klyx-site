import { expect, test } from "@playwright/test";

import fr from "../messages/fr.json";

const CAL_HOST = /(^|\.)cal\.com$/;
const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL;

test("/contact loads nothing from Cal.com until the booking button is clicked", async ({
  page,
}) => {
  const calRequests: string[] = [];
  page.on("request", (request) => {
    if (CAL_HOST.test(new URL(request.url()).hostname)) {
      calRequests.push(request.url());
    }
  });

  await page.goto("/contact");
  await page.waitForLoadState("networkidle");
  expect(calRequests).toEqual([]);
  await expect(page.locator('script[src*="cal.com"]')).toHaveCount(0);
  await expect(page.locator("#booking iframe")).toHaveCount(0);

  await page
    .locator("#booking")
    .getByRole("link", { name: fr.contact.booking.title })
    .or(
      page
        .locator("#booking")
        .getByRole("button", { name: fr.contact.booking.title }),
    )
    .click();

  if (CAL_URL) {
    await expect(page.locator("#booking iframe")).toHaveAttribute(
      "src",
      new RegExp(`^${CAL_URL}`),
    );
    return;
  }
  await expect(page).toHaveURL(/#contact-form$/);
  expect(calRequests).toEqual([]);
});

test("the form reports how long it took to fill", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator('input[name="locale"]')).toBeAttached();
  await page.waitForLoadState("networkidle");

  const posted = new Promise<string>((resolve) => {
    void page.route("**/contact*", async (route) => {
      if (route.request().method() !== "POST") return route.fallback();
      resolve(route.request().postData() ?? "");
      await route.abort();
    });
  });

  await page.locator("#contact-name").fill("Ada Lovelace");
  await page.locator("#contact-email").fill("ada@example.com");
  await page.locator("#contact-need").click();
  await page.getByRole("option").first().click();
  await page.locator("#contact-message").fill("Nous voulons automatiser.");
  await page.locator("#contact-consent").click();
  await page.locator('form button[type="submit"]').click();

  const body = await posted;
  const fillMs = /name="[^"]*fillMs"\r\n\r\n([\d.]+)/.exec(body)?.[1];
  expect(Number(fillMs)).toBeGreaterThan(0);
});
