import type { OfferId } from "./offers";
import type { ScenarioId } from "./scenarios";
import type { SectorKey } from "./sector-pages";

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
  anchor: OfferId;
  block: OfferBlock;
  proofSlugs: string[];
  proofLink: "cases" | null;
  stack?: true;
  process: boolean;
  pricing: boolean;
  anchorLine?: true;
  cta: [OfferAction, OfferAction];
  sectors: SectorKey[];
};

export const offerPages: Record<OfferPageKey, OfferPageConfig> = {
  sites: {
    key: "sites",
    pathname: "/services/creation-site-web",
    namespace: "sites",
    scenario: "sites",
    tiers: ["landing", "site-ia", "site-custom"],
    anchor: "landing",
    block: "lighthouse",
    proofSlugs: ["pkba", "vertiflow"],
    proofLink: "cases",
    process: true,
    pricing: true,
    cta: ["quote", "book"],
    sectors: ["agencies"],
  },
  agents: {
    key: "agents",
    pathname: "/services/agents-ia",
    namespace: "agents",
    scenario: "support",
    tiers: ["audit-ia", "sprint-ia", "retainer"],
    anchor: "audit-ia",
    block: "trace",
    stack: true,
    proofSlugs: ["hop-hop-immo", "citeme"],
    proofLink: "cases",
    process: false,
    pricing: false,
    anchorLine: true,
    cta: ["book", "quote"],
    sectors: ["realEstate", "agencies"],
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
    proofLink: null,
    process: true,
    pricing: true,
    cta: ["book", "quote"],
    sectors: ["agencies"],
  },
  audit: {
    key: "audit",
    pathname: "/services/audit-ia",
    namespace: "audit",
    scenario: "audit",
    tiers: ["audit-ia", "automation", "sprint-ia"],
    anchor: "audit-ia",
    block: "audit-document",
    proofSlugs: [],
    proofLink: null,
    process: false,
    pricing: true,
    cta: ["book", "quote"],
    sectors: ["services", "realEstate"],
  },
  automation: {
    key: "automation",
    pathname: "/services/automatisation-ia",
    namespace: "automation",
    scenario: "automation",
    tiers: ["automation", "automation-care", "sprint-ia"],
    anchor: "automation",
    block: "automation-examples",
    stack: true,
    proofSlugs: [],
    proofLink: null,
    process: false,
    pricing: true,
    cta: ["book", "quote"],
    sectors: ["services", "realEstate"],
  },
  geo: {
    key: "geo",
    pathname: "/services/geo-referencement-ia",
    namespace: "geo",
    scenario: "geo",
    tiers: ["geo", "geo-care", "site-ia"],
    anchor: "geo",
    block: "geo-visibility",
    proofSlugs: ["citeme"],
    proofLink: "cases",
    process: false,
    pricing: true,
    cta: ["book", "quote"],
    sectors: ["agencies"],
  },
};

export const OFFER_PAGE_KEYS = Object.keys(offerPages) as OfferPageKey[];
