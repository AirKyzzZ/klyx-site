import { describe, expect, it } from "vitest";

import { site } from "@/lib/site";

import { GET } from "./route";

describe("blog rss", () => {
  it("returns an RSS 2.0 document", async () => {
    const response = await GET();
    expect(response.headers.get("content-type")).toContain(
      "application/rss+xml",
    );
    const body = await response.text();
    expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
      true,
    );
    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain("<link>https://klyx.fr/blog</link>");
    expect(body).toContain(`<description>${site.description}</description>`);
  });
});
