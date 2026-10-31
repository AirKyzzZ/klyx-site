import { describe, expect, it } from "vitest";

import { LEAD_MAGNET_PATH, isGone, legacyRedirects } from "./legacy-urls";

describe("isGone", () => {
  it.each([
    "/wp-login.php",
    "/xmlrpc.php",
    "/wp-admin",
    "/wp-admin/admin-ajax.php",
    "/wp-json/wp/v2/posts",
    "/wp-content/themes/x/style.css",
    "/wp-content/uploads/2025/07/other.pdf",
  ])("is true for %s", (pathname) => {
    expect(isGone(pathname)).toBe(true);
  });

  it.each([
    "/tarifs",
    "/",
    "/blog/rss.xml",
    "/wp-contentious",
    LEAD_MAGNET_PATH,
  ])("is false for %s", (pathname) => {
    expect(isGone(pathname)).toBe(false);
  });
});

describe("legacyRedirects", () => {
  it("only holds permanent redirects", () => {
    expect(legacyRedirects.every((r) => r.permanent)).toBe(true);
  });

  it("sends the attachment_id query on / to the lead magnet", () => {
    const rule = legacyRedirects.find((r) => r.has);
    expect(rule).toMatchObject({
      source: "/",
      destination: LEAD_MAGNET_PATH,
      has: [{ type: "query", key: "attachment_id", value: "425" }],
    });
  });

  it("maps the old sitemaps to /sitemap.xml and the feed to /blog/rss.xml", () => {
    const byDest = (destination: string) =>
      legacyRedirects
        .filter((r) => r.destination === destination)
        .map((r) => r.source);
    expect(byDest("/sitemap.xml").sort()).toEqual([
      "/page-sitemap.xml",
      "/sitemap_index.xml",
      "/wp-sitemap.xml",
    ]);
    expect(byDest("/blog/rss.xml")).toEqual(["/feed"]);
  });
});
