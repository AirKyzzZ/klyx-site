import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";
import { getCaseStudies } from "@/lib/content";

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

  it("lists every case study in both locales", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    for (const study of await getCaseStudies("fr")) {
      expect(urls).toContain(`https://klyx.fr/realisations/${study.slug}`);
      expect(urls).toContain(`https://klyx.fr/en/work/${study.slug}`);
    }
  });
});
