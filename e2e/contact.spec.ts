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
