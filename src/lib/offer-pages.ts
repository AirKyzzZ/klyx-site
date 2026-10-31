import type { OfferId } from "./offers";
import type { ScenarioId } from "./scenarios";

export type OfferPageKey =
  "sites" | "agents" | "fde" | "audit" | "automation" | "geo";

export type OfferPathname =
  | "/services/creation-site-web"
  | "/services/agents-ia"
  | "/forward-deployed-engineer"
  | "/services/audit-ia"
  | "/services/automatisation-ia"
  | "/services/geo-referencement-ia";

export type OfferBlock =
  | "trace"
  | "lighthouse"
  | "fde-definition"
  | "audit-document"
  | "automation-examples"
  | "geo-visibility";

export type OfferAction = "book" | "quote";

export type OfferPageConfig = {
  key: OfferPageKey;
  pathname: OfferPathname;
  namespace: OfferPageKey;
  scenario: ScenarioId;
  tiers: OfferId[];
  highlighted?: OfferId;
  anchor: OfferId;
  block: OfferBlock;
  proofSlugs: string[];
  proofLink: "cases" | "github";
  cta: [OfferAction, OfferAction];
};

export const offerPages: Record<OfferPageKey, OfferPageConfig> = {
  sites: {
    key: "sites",
    pathname: "/services/creation-site-web",
    namespace: "sites",
    scenario: "sites",
    tiers: ["landing", "site-ia", "site-custom"],
    highlighted: "site-ia",
    anchor: "landing",
    block: "lighthouse",
    proofSlugs: ["kenzi", "pkba", "vertiflow"],
    proofLink: "cases",
    cta: ["quote", "book"],
  },
  agents: {
    key: "agents",
    pathname: "/services/agents-ia",
    namespace: "agents",
    scenario: "agents",
    tiers: ["audit-ia", "sprint-ia", "retainer"],
    highlighted: "sprint-ia",
    anchor: "audit-ia",
    block: "trace",
    proofSlugs: ["hop-hop-immo", "citeme"],
    proofLink: "cases",
    cta: ["book", "quote"],
  },
  fde: {
    key: "fde",
    pathname: "/forward-deployed-engineer",
    namespace: "fde",
    scenario: "fde",
    tiers: ["fde"],
    anchor: "fde",
    block: "fde-definition",
    proofSlugs: [],
    proofLink: "github",
    cta: ["book", "quote"],
  },
  audit: {
    key: "audit",
    pathname: "/services/audit-ia",
    namespace: "audit",
    scenario: "audit",
    tiers: ["audit-ia", "automation", "sprint-ia"],
    highlighted: "audit-ia",
    anchor: "audit-ia",
    block: "audit-document",
    proofSlugs: ["hop-hop-immo"],
    proofLink: "cases",
    cta: ["book", "quote"],
  },
  automation: {
    key: "automation",
    pathname: "/services/automatisation-ia",
    namespace: "automation",
    scenario: "automation",
    tiers: ["automation", "automation-care", "sprint-ia"],
    highlighted: "automation",
    anchor: "automation",
    block: "automation-examples",
    proofSlugs: ["hop-hop-immo"],
    proofLink: "cases",
    cta: ["book", "quote"],
  },
  geo: {
    key: "geo",
    pathname: "/services/geo-referencement-ia",
    namespace: "geo",
    scenario: "geo",
    tiers: ["geo", "geo-care", "site-ia"],
    highlighted: "geo",
    anchor: "geo",
    block: "geo-visibility",
    proofSlugs: ["citeme"],
    proofLink: "cases",
    cta: ["book", "quote"],
  },
};

export const OFFER_PAGE_KEYS = Object.keys(offerPages) as OfferPageKey[];
