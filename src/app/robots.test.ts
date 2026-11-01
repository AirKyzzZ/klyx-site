import { describe, expect, it } from "vitest";

import robots from "./robots";

const AI_AND_SEARCH_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Google-Extended",
  "Bingbot",
];

describe("robots", () => {
  it("allows AI and search crawlers and points to the sitemap", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    for (const bot of AI_AND_SEARCH_BOTS) {
      const rule = rules.find((r) => [r.userAgent].flat().includes(bot));
      expect(rule, bot).toBeDefined();
      expect(rule?.allow).toBe("/");
      expect(rule?.disallow).toBeUndefined();
    }
    expect(result.sitemap).toBe("https://klyx.fr/sitemap.xml");
  });
});
