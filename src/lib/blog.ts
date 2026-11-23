import type { Locale } from "@/i18n/routing";

import { type PostMeta, getMdxBody, getPosts, readingMinutes } from "./content";
import type { OfferPageKey } from "./offer-pages";
import { type Offer, type OfferId, getOffer } from "./offers";

const SERVICE_OFFERS: Record<OfferPageKey, OfferId> = {
  sites: "landing",
  agents: "sprint-ia",
  fde: "fde",
  audit: "audit-ia",
  automation: "automation",
  geo: "geo",
};

export const POST_SERVICES: Record<string, readonly OfferPageKey[]> = {
  "cout-agent-ia-pme": ["agents", "audit"],
  "integrer-ia-pme-methode": ["audit", "automation"],
  "etre-cite-par-chatgpt-perplexity": ["geo", "sites"],
  "forward-deployed-engineer-definition": ["fde", "agents"],
  "audit-ia-bpifrance-diagnostic-data-ia": ["audit"],
};

export type PostService = { key: OfferPageKey; offer: Offer };

export function postServices(slug: string): PostService[] {
  return (POST_SERVICES[slug] ?? []).map((key) => ({
    key,
    offer: getOffer(SERVICE_OFFERS[key]),
  }));
}

export function formatPostDate(locale: Locale, date: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(date));
}

export type PostSummary = PostMeta & {
  minutes: number;
  topic?: OfferPageKey;
};

export async function getPostSummaries(locale: Locale): Promise<PostSummary[]> {
  const posts = await getPosts(locale);
  return Promise.all(
    posts.map(async (post) => ({
      ...post,
      minutes: readingMinutes(await getMdxBody("blog", post.slug, locale)),
      topic: POST_SERVICES[post.slug]?.[0],
    })),
  );
}
