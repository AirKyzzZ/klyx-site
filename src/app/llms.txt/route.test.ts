import { describe, expect, it } from "vitest";

import { formatPrice } from "@/lib/offers";

import { GET } from "./route";

describe("llms.txt", () => {
  it("lists offers with prices, key pages in both locales and contact", async () => {
    const response = GET();
    expect(response.headers.get("content-type")).toContain("text/plain");
    const body = await response.text();
    expect(body.startsWith("# Klyx\n")).toBe(true);
    expect(body).toContain(formatPrice(4500, "fr"));
    expect(body).toContain(formatPrice(700, "fr"));
    expect(body).toContain("https://klyx.fr/tarifs");
    expect(body).toContain("https://klyx.fr/en/pricing");
    expect(body).toContain("contact@klyx.fr");
    expect(body).not.toContain("TODO");
  });
});
