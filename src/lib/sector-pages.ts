import type { OfferId } from "./offers";
import type { ScenarioId } from "./scenarios";

export type SectorKey = "realEstate" | "agencies" | "services";

export type SectorPathname =
  | "/cas-usage/immobilier"
  | "/cas-usage/agences"
  | "/cas-usage/cabinets-services";

export type SectorProof =
  | { kind: "cases"; slugs: string[] }
  | { kind: "none"; href: "/services/audit-ia" };

export type SectorPageConfig = {
  key: SectorKey;
  pathname: SectorPathname;
  namespace: `useCases.${SectorKey}`;
  scenario: ScenarioId;
  offers: OfferId[];
  anchor: OfferId;
  proof: SectorProof;
  illustrated?: true;
  terms?: true;
};

export const sectorPages: Record<SectorKey, SectorPageConfig> = {
  realEstate: {
    key: "realEstate",
    pathname: "/cas-usage/immobilier",
    namespace: "useCases.realEstate",
    scenario: "realEstate",
    offers: ["audit-ia", "automation", "sprint-ia"],
    anchor: "audit-ia",
    proof: { kind: "cases", slugs: ["hop-hop-immo"] },
  },
  agencies: {
    key: "agencies",
    pathname: "/cas-usage/agences",
    namespace: "useCases.agencies",
    scenario: "agencies",
    offers: ["landing", "site-ia", "sprint-ia", "fde"],
    anchor: "landing",
    proof: { kind: "cases", slugs: ["pkba", "vertiflow"] },
    terms: true,
  },
  services: {
    key: "services",
    pathname: "/cas-usage/cabinets-services",
    namespace: "useCases.services",
    scenario: "services",
    offers: ["audit-ia", "automation", "automation-care", "sprint-ia"],
    anchor: "audit-ia",
    proof: { kind: "none", href: "/services/audit-ia" },
    illustrated: true,
  },
};

export const SECTOR_KEYS = Object.keys(sectorPages) as SectorKey[];
