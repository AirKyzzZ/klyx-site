// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { LEAD_MAGNET_PATH } from "./lib/legacy-urls";
import proxy from "./proxy";

const run = (path: string) => proxy(new NextRequest(`https://klyx.fr${path}`));

describe("proxy legacy redirects", () => {
  it.each([
    ["/agence-web-bordeaux", "/"],
    ["/category/actualites", "/"],
    ["/author/maxime", "/"],
    ["/feed", "/blog/rss.xml"],
    ["/?attachment_id=425", LEAD_MAGNET_PATH],
    ["/wp-sitemap.xml", "/sitemap.xml"],
  ])("answers %s with a 308 to %s before next-intl", (path, destination) => {
    const response = run(path);
    expect(response.status).toBe(308);
    expect(new URL(response.headers.get("location") ?? "").pathname).toBe(
      destination,
    );
  });

  it("still returns 410 for WordPress internals", () => {
    expect(run("/wp-login.php").status).toBe(410);
  });

  it("hands normal pages to next-intl", () => {
    expect(run("/tarifs").status).not.toBe(308);
  });
});
