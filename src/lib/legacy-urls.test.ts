import { unstable_doesMiddlewareMatch as doesProxyMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import proxy, { config } from "@/proxy";

import {
  LEAD_MAGNET_PATH,
  findLegacyRedirect,
  isGone,
  legacyRedirects,
} from "./legacy-urls";

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

describe("findLegacyRedirect", () => {
  const find = (pathname: string, query = "") =>
    findLegacyRedirect(pathname, new URLSearchParams(query));

  it.each([
    ["/agence-web-bordeaux", "/"],
    ["/agence-web-bordeaux/", "/"],
    ["/category", "/"],
    ["/category/actualites/web", "/"],
    ["/author/maxime/", "/"],
    ["/feed", "/blog/rss.xml"],
    ["/feed/", "/blog/rss.xml"],
    ["/wp-sitemap.xml", "/sitemap.xml"],
  ])("sends %s to %s", (pathname, destination) => {
    expect(find(pathname)).toBe(destination);
  });

  it("sends /?attachment_id=425 to the lead magnet", () => {
    expect(find("/", "attachment_id=425")).toBe(LEAD_MAGNET_PATH);
  });

  it.each([
    ["/", ""],
    ["/", "attachment_id=12"],
    ["/categoryx", ""],
    ["/tarifs", ""],
    ["/blog/rss.xml", ""],
  ])("leaves %s?%s alone", (pathname, query) => {
    expect(find(pathname, query)).toBeNull();
  });
});

describe("proxy redirects", () => {
  const redirectOf = (url: string) => {
    const response = proxy(new NextRequest(`https://klyx.fr${url}`));
    return {
      status: response.status,
      location: response.headers.get("location"),
    };
  };

  it.each([
    ["/feed", "https://klyx.fr/blog/rss.xml"],
    ["/feed/", "https://klyx.fr/blog/rss.xml"],
    ["/agence-web-bordeaux/", "https://klyx.fr/"],
    ["/author/maxime/", "https://klyx.fr/"],
  ])("sends %s to %s in one hop", (url, location) => {
    expect(redirectOf(url)).toEqual({ status: 308, location });
  });

  it("keeps the query string", () => {
    expect(redirectOf("/?attachment_id=425")).toEqual({
      status: 308,
      location: `https://klyx.fr${LEAD_MAGNET_PATH}?attachment_id=425`,
    });
  });
});

describe("proxy matcher", () => {
  const matches = (url: string) => doesProxyMatch({ config, url });

  it.each([
    "/",
    "/tarifs",
    "/feed/",
    "/apiculture",
    "/trpc-guide",
    "/_vercel-case",
    "/mdx",
    "/blog/opengraph-image-guide",
    "/foo/opengraph-image/bar",
    "/opengraph-image",
    "/wp-login.php",
    "/wp-content/themes/x/style.css",
    "/sitemap_index.xml",
  ])("runs on %s", (url) => {
    expect(matches(url)).toBe(true);
  });

  it.each([
    "/api/contact",
    "/trpc/hello",
    "/_next/static/chunk.js",
    "/_vercel/insights/script.js",
    "/md/fr/tarifs",
    "/fr/opengraph-image",
    "/fr/tarifs/opengraph-image",
    "/blog/rss.xml",
    "/llms.txt",
  ])("skips %s", (url) => {
    expect(matches(url)).toBe(false);
  });
});
