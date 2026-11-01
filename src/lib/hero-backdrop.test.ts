import { describe, expect, it } from "vitest";

import { DEFAULT_HERO_BACKDROP, parseHeroBackdrop } from "./hero-backdrop";

describe("parseHeroBackdrop", () => {
  it("falls back to the default when the flag is unset", () => {
    expect(parseHeroBackdrop(undefined)).toBe(DEFAULT_HERO_BACKDROP);
    expect(parseHeroBackdrop("")).toBe(DEFAULT_HERO_BACKDROP);
  });

  it.each(["grid", "mesh", "flow", "painting"])("accepts %s", (value) => {
    expect(parseHeroBackdrop(value)).toBe(value);
  });

  it("rejects an unknown value with the allowed list", () => {
    expect(() => parseHeroBackdrop("video")).toThrow(
      /grid, mesh, flow, painting/,
    );
  });
});
