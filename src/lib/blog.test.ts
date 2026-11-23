import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";

import { formatPostDate, postServices } from "./blog";
import { getPosts } from "./content";

describe("postServices", () => {
  it.each(routing.locales)(
    "links every published %s post to at least one priced service",
    async (locale) => {
      for (const post of await getPosts(locale)) {
        const services = postServices(post.slug);
        expect(services.length, post.slug).toBeGreaterThan(0);
        for (const { offer } of services) {
          expect(offer.priceFrom, post.slug).not.toBeNull();
        }
      }
    },
  );

  it("returns nothing for an unknown post", () => {
    expect(postServices("nope")).toEqual([]);
  });
});

describe("formatPostDate", () => {
  it("prints the day the post was written, whatever the server timezone", () => {
    expect(formatPostDate("fr", "2026-11-03")).toBe("3 novembre 2026");
    expect(formatPostDate("en", "2026-11-03")).toBe("November 3, 2026");
  });
});
