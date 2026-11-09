import { describe, expect, it } from "vitest";

import { getPosts } from "./content";
import { followingItems, OFFER_POST_SLUGS } from "./related-content";

const items = ["a", "b", "c", "d"].map((slug) => ({ slug }));
const slugs = (list: { slug: string }[]) => list.map((item) => item.slug);

describe("followingItems", () => {
  it("wraps around the end of the list", () => {
    expect(slugs(followingItems(items, "c", 3))).toEqual(["d", "a", "b"]);
  });

  it("never returns the current item", () => {
    expect(slugs(followingItems(items, "a", 10))).toEqual(["b", "c", "d"]);
  });

  it("returns nothing for an unknown slug", () => {
    expect(followingItems(items, "z", 3)).toEqual([]);
  });
});

describe("OFFER_POST_SLUGS", () => {
  it.each(["fr", "en"] as const)(
    "points at published %s posts",
    async (locale) => {
      const published = slugs(await getPosts(locale));
      expect(published).toEqual(
        expect.arrayContaining(Object.values(OFFER_POST_SLUGS)),
      );
    },
  );
});
