import { getPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function GET() {
  const posts = await getPosts("fr");
  const items = posts
    .map((post) => {
      const url = absoluteUrl("fr", "/blog/[slug]", { slug: post.slug });
      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `<description>${escapeXml(post.summary)}</description>`,
        "</item>",
      ].join("");
    })
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Klyx</title><link>${site.url}/blog</link><description>${escapeXml(site.description)}</description><language>fr-FR</language>${items}</channel></rss>`;

  return new Response(feed, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
