import { describe, expect, it } from "vitest";

import { getLocaleHref } from "./locale-href";

describe("getLocaleHref", () => {
  it("keeps fr unprefixed and prefixes en", () => {
    expect(getLocaleHref("fr", "/tarifs", {})).toBe("/tarifs");
    expect(getLocaleHref("en", "/tarifs", {})).toBe("/en/pricing");
  });

  it("localizes dynamic routes and ignores the locale param", () => {
    const params = { locale: "fr", slug: "hop-hop-immo" };
    expect(getLocaleHref("fr", "/realisations/[slug]", params)).toBe(
      "/realisations/hop-hop-immo",
    );
    expect(getLocaleHref("en", "/realisations/[slug]", params)).toBe(
      "/en/work/hop-hop-immo",
    );
  });
});
