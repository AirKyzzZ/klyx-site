import type { OfferPageKey } from "./offer-pages";

export const PRICING_POST_SLUG = "cout-agent-ia-pme";

export const OFFER_POST_SLUGS: Partial<Record<OfferPageKey, string>> = {
  agents: "cout-agent-ia-pme",
  fde: "forward-deployed-engineer-definition",
  audit: "integrer-ia-pme-methode",
  automation: "integrer-ia-pme-methode",
  geo: "etre-cite-par-chatgpt-perplexity",
};

export function followingItems<T extends { slug: string }>(
  items: T[],
  slug: string,
  count: number,
): T[] {
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return [];
  return [...items.slice(index + 1), ...items.slice(0, index)].slice(0, count);
}
