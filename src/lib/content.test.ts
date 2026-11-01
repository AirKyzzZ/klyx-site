import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getCaseStudies, getCaseStudy } from "./content";

const dir = path.join(process.cwd(), "content/realisations");
const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
const slugs = [...new Set(files.map((f) => f.replace(/\.(fr|en)\.mdx$/, "")))];

describe("case studies", () => {
  it("has the five expected slugs", () => {
    expect(slugs.sort()).toEqual([
      "citeme",
      "hop-hop-immo",
      "kenzi",
      "pkba",
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

  it("sorts by order", async () => {
    const orders = (await getCaseStudies("fr")).map((s) => s.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(orders).toHaveLength(4);
  });

  it.each(["fr", "en"] as const)(
    "%s keeps Kenzi out of every listing until its write-up exists",
    async (locale) => {
      const listed = (await getCaseStudies(locale)).map((s) => s.slug);
      expect(listed).not.toContain("kenzi");
      const { meta } = await getCaseStudy("kenzi", locale);
      expect(meta.listed).toBe(false);
    },
  );
});
