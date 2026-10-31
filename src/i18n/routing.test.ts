import { describe, expect, it } from "vitest";

import { getPathname } from "./navigation";
import { routing } from "./routing";

describe("routing", () => {
  it("has an en entry for every pathname", () => {
    for (const [key, value] of Object.entries(routing.pathnames)) {
      expect(typeof value === "string" ? value : value.en, key).toBeTruthy();
    }
  });

  it("prefixes non-default locales with localized slugs", () => {
    expect(getPathname({ locale: "en", href: "/tarifs" })).toBe("/en/pricing");
  });

  it("leaves the default locale unprefixed", () => {
    expect(getPathname({ locale: "fr", href: "/tarifs" })).toBe("/tarifs");
  });
});
