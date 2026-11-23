import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";
import { getCaseStudies, getPosts } from "@/lib/content";
import { site } from "@/lib/site";

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists every static route in both locales with alternates", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);
    const staticRoutes = Object.keys(routing.pathnames).filter(
      (pathname) => !pathname.includes("["),
    );
    expect(urls).toContain("https://klyx.fr/");
    expect(urls).toContain("https://klyx.fr/en");
    expect(urls).toContain("https://klyx.fr/tarifs");
    expect(urls).toContain("https://klyx.fr/en/pricing");
    expect(entries.length).toBeGreaterThanOrEqual(staticRoutes.length * 2);
    for (const entry of entries) {
      expect(entry.alternates?.languages).toMatchObject({
        fr: expect.stringMatching(/^https:\/\/klyx\.fr/),
        en: expect.stringMatching(/^https:\/\/klyx\.fr\/en/),
        "x-default": entry.alternates?.languages?.fr,
      });
    }
  });

  it("lists the new service pages with their hreflang pairs", async () => {
    const entries = await sitemap();
    const pairs = [
      ["/services/audit-ia", "/en/services/ai-audit"],
      ["/services/automatisation-ia", "/en/services/ai-automation"],
      ["/services/geo-referencement-ia", "/en/services/ai-search-visibility"],
    ];
    for (const [fr, en] of pairs) {
      const entry = entries.find((e) => e.url === `https://klyx.fr${fr}`);
      expect(entry?.alternates?.languages).toMatchObject({
        fr: `https://klyx.fr${fr}`,
        en: `https://klyx.fr${en}`,
      });
    }
  });

  it("lists every case study in both locales", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    for (const study of await getCaseStudies("fr")) {
      expect(urls).toContain(`https://klyx.fr/realisations/${study.slug}`);
      expect(urls).toContain(`https://klyx.fr/en/work/${study.slug}`);
    }
  });

  it("gives every entry a real lastModified date", async () => {
    const entries = await sitemap();
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));
    for (const entry of entries) {
      expect(entry.lastModified, entry.url).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(byUrl.get("https://klyx.fr/tarifs")?.lastModified).toBe(
      site.pagesUpdatedAt,
    );
    expect(byUrl.get("https://klyx.fr/en/legal-notice")?.lastModified).toBe(
      site.legalUpdatedAt,
    );
    for (const post of await getPosts("fr")) {
      expect(byUrl.get(`https://klyx.fr/blog/${post.slug}`)?.lastModified).toBe(
        post.updated ?? post.date,
      );
    }
  });
});
