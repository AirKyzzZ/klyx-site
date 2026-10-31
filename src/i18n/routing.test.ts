import { describe, expect, it } from "vitest";

import { getLocaleHref } from "./locale-href";
import { getPathname } from "./navigation";
import { routing } from "./routing";

const NEW_SERVICES = [
  ["/services/audit-ia", "/en/services/ai-audit"],
  ["/services/automatisation-ia", "/en/services/ai-automation"],
  ["/services/geo-referencement-ia", "/en/services/ai-search-visibility"],
] as const;

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

  it.each(NEW_SERVICES)("serves %s in fr and en", (fr, en) => {
    expect(getPathname({ locale: "fr", href: fr })).toBe(fr);
    expect(getPathname({ locale: "en", href: fr })).toBe(en);
  });

  it.each(NEW_SERVICES)("switches language on %s", (pathname, en) => {
    expect(getLocaleHref("en", pathname, { locale: "fr" })).toBe(en);
    expect(getLocaleHref("fr", pathname, { locale: "en" })).toBe(pathname);
  });
});
