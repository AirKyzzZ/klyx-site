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

  it("links the markdown alternate of the home and every key page", async () => {
    const body = await GET().text();
    expect(body).toContain("Markdown : https://klyx.fr/md/fr\n");
    expect(body).toContain("(Markdown : https://klyx.fr/md/fr/tarifs)");
    expect(body).toContain(
      "(Markdown : https://klyx.fr/md/fr/services/agents-ia)",
    );
    expect(body).toContain("(Markdown : https://klyx.fr/md/fr/contact)");
  });

  it("lists the use-case and faq pages", async () => {
    const body = await GET().text();
    for (const url of [
      "https://klyx.fr/cas-usage",
      "https://klyx.fr/en/use-cases/real-estate",
      "https://klyx.fr/cas-usage/agences",
      "https://klyx.fr/en/use-cases/professional-services",
      "https://klyx.fr/faq",
    ]) {
      expect(body).toContain(url);
    }
  });
});
