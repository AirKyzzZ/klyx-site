import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getCaseStudies, getCaseStudy } from "./content";

const dir = path.join(process.cwd(), "content/realisations");
const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
const slugs = [...new Set(files.map((f) => f.replace(/\.(fr|en)\.mdx$/, "")))];

describe("case studies", () => {
  it("has the ten expected slugs", () => {
    expect(slugs.sort()).toEqual([
      "2060-io",
      "citeme",
      "crealogique",
      "cronolyss",
      "hop-hop-immo",
      "kenzi",
      "lady-gallery",
      "pkba",
      "reciproq",
      "vertiflow",
    ]);
  });

  it.each(slugs)("%s exists in fr and en", (slug) => {
    expect(files).toContain(`${slug}.fr.mdx`);
    expect(files).toContain(`${slug}.en.mdx`);
  });

  it.each(["fr", "en"] as const)("%s metadata is complete", async (locale) => {
    for (const slug of slugs) {
      const { meta } = await getCaseStudy(slug, locale);
      for (const key of [
        "title",
        "name",
        "kind",
        "client",
        "url",
        "summary",
        "image",
      ] as const) {
        expect(meta[key], `${slug}.${locale} ${key}`).not.toBe("");
      }
      expect(meta.year).toBeGreaterThan(2020);
      expect(meta.stack.length).toBeGreaterThan(0);
    }
  });

  it.each(["fr", "en"] as const)(
    "%s gives the shortest case studies a 120 to 155 character meta description",
    async (locale) => {
      for (const slug of ["kenzi", "vertiflow", "reciproq"]) {
        const { meta } = await getCaseStudy(slug, locale);
        expect(meta.description, `${slug}.${locale}`).toBeDefined();
      }
      for (const slug of slugs) {
        const { meta } = await getCaseStudy(slug, locale);
        if (!meta.description) continue;
        expect(meta.description.length, slug).toBeGreaterThanOrEqual(120);
        expect(meta.description.length, slug).toBeLessThanOrEqual(155);
      }
    },
  );

  it("sorts by order", async () => {
    const orders = (await getCaseStudies("fr")).map((s) => s.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(orders).toHaveLength(10);
  });

  it.each(["fr", "en"] as const)(
    "%s lists Kenzi without a live link while its site is down",
    async (locale) => {
      const listed = (await getCaseStudies(locale)).map((s) => s.slug);
      expect(listed).toContain("kenzi");
      const { meta } = await getCaseStudy("kenzi", locale);
      expect(meta.live).toBe(false);
    },
  );

  it.each(["fr", "en"] as const)(
    "%s marks Créalogique as in development, with no live link",
    async (locale) => {
      const { meta } = await getCaseStudy("crealogique", locale);
      expect(meta.status).toBe("inDevelopment");
      expect(meta.live).toBe(false);
    },
  );
});
