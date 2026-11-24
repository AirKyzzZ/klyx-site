import { describe, expect, it } from "vitest";

import { getPosts } from "@/lib/content";
import { formatPrice } from "@/lib/offers";
import { site } from "@/lib/site";

import { GET } from "./route";

describe("llms.txt", () => {
  it("lists offers with prices, key pages in both locales and contact", async () => {
    const response = await GET();
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
    const body = await (await GET()).text();
    expect(body).toContain("Markdown : https://klyx.fr/md/fr\n");
    expect(body).toContain("(Markdown : https://klyx.fr/md/fr/tarifs)");
    expect(body).toContain(
      "(Markdown : https://klyx.fr/md/fr/services/agents-ia)",
    );
    expect(body).toContain("(Markdown : https://klyx.fr/md/fr/contact)");
  });

  it("lists the use-case and faq pages", async () => {
    const body = await (await GET()).text();
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

  it("says who runs Klyx, where it is registered and the area served", async () => {
    const body = await (await GET()).text();
    expect(body).toContain(site.description);
    expect(body).toContain(`Fondateur : ${site.founder}`);
    expect(body).toContain("Adresse légale : 33120 Arcachon (");
    expect(body).not.toContain("Téléphone");
    expect(body).toContain("Zone servie : Bordeaux, Gironde, France.");
  });

  it("prices the monthly run on quote instead of leaving it blank", async () => {
    const body = await (await GET()).text();
    expect(body).toMatch(/\[Suivi mensuel\]\([^)]+\): Sur devis\. /);
  });

  it("lists every published guide with its markdown alternate", async () => {
    const body = await (await GET()).text();
    expect(body).toContain("## Guides");
    for (const post of await getPosts("fr")) {
      expect(body).toContain(
        `- [${post.title}](https://klyx.fr/blog/${post.slug}) (Markdown : https://klyx.fr/md/fr/blog/${post.slug})`,
      );
    }
  });
});
