import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

const WELCOME_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Google-Extended",
  "Bingbot",
  "Googlebot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: WELCOME_CRAWLERS, allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
