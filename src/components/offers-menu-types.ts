import type { Offer } from "@/lib/offers";

export type NavHref = "/realisations" | "/tarifs" | "/a-propos";

export type OfferLink = {
  href: Offer["page"];
  title: string;
  description: string;
  price: string;
};

export type OfferGroup = { label: string; items: OfferLink[] };

export type OffersMenuProps = {
  offersLabel: string;
  offerGroups: OfferGroup[];
  links: { href: NavHref; label: string }[];
};

export const OFFERS_TRIGGER_CLASS =
  "text-text-2 hover:bg-surface-2 hover:text-text data-[state=open]:text-text h-8 rounded-full bg-transparent px-3 font-medium";

export const PILL_LINK_CLASS =
  "inline-flex h-8 items-center rounded-full px-3 text-sm font-medium text-text-2 transition-colors duration-(--d-fast) hover:bg-surface-2 hover:text-text aria-[current=page]:text-text";
