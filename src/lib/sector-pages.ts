import type { OfferPathname } from "./offer-pages";
import type { OfferId } from "./offers";
import { type Tool, type ToolLogoId, TOOLS } from "./tools";

export type SectorKey = "realEstate" | "agencies" | "services";

export type SectorPathname =
  | "/cas-usage/immobilier"
  | "/cas-usage/agences"
  | "/cas-usage/cabinets-services";

export type SectorProof =
  | { kind: "cases"; slugs: string[] }
  | { kind: "none"; href: "/services/audit-ia" };

export type ToolFlow = { from: ToolLogoId[]; to: ToolLogoId[] };

export type SectorWorkflow = ToolFlow & { id: string; builtByUs?: true };

export type SectorPageConfig = {
  key: SectorKey;
  pathname: SectorPathname;
  namespace: `useCases.${SectorKey}`;
  flow: ToolFlow;
  workflows: SectorWorkflow[];
  offers: [OfferId, OfferId, OfferId];
  anchor: OfferId;
  quoteOffer: OfferId;
  proof: SectorProof;
  tools: Tool[];
  terms?: true;
  ownMethod?: true;
  pricingNoteHref?: OfferPathname;
};

export const sectorPages: Record<SectorKey, SectorPageConfig> = {
  realEstate: {
    key: "realEstate",
    pathname: "/cas-usage/immobilier",
    namespace: "useCases.realEstate",
    flow: { from: ["outlook"], to: ["hubspot", "google"] },
    workflows: [
      { id: "listing", from: ["wordpress"], to: ["hubspot", "gmail"] },
      { id: "leads", from: ["outlook"], to: ["hubspot", "microsoft-teams"] },
      { id: "visits", from: ["gmail"], to: ["google", "whatsapp"] },
      { id: "owners", from: ["hubspot"], to: ["gmail"] },
    ],
    offers: ["audit-ia", "automation", "sprint-ia"],
    anchor: "audit-ia",
    quoteOffer: "automation",
    proof: { kind: "cases", slugs: ["hop-hop-immo"] },
    tools: [TOOLS.gmail, TOOLS.outlook, TOOLS.whatsapp, TOOLS.hubspot],
  },
  agencies: {
    key: "agencies",
    pathname: "/cas-usage/agences",
    namespace: "useCases.agencies",
    flow: { from: ["wordpress"], to: ["hubspot", "slack"] },
    workflows: [
      { id: "assistant", from: ["wordpress"], to: ["gmail", "slack"] },
      { id: "leads", from: ["gmail"], to: ["pipedrive", "slack"] },
      { id: "products", from: ["google-sheets"], to: ["shopify"] },
      {
        id: "site",
        from: ["figma"],
        to: ["nextjs", "github"],
        builtByUs: true,
      },
    ],
    offers: ["landing", "site-ia", "sprint-ia"],
    anchor: "landing",
    quoteOffer: "sprint-ia",
    proof: { kind: "cases", slugs: ["pkba", "vertiflow"] },
    tools: [TOOLS.hubspot, TOOLS.pipedrive, TOOLS.shopify, TOOLS.wordpress],
    terms: true,
    ownMethod: true,
    pricingNoteHref: "/forward-deployed-engineer",
  },
  services: {
    key: "services",
    pathname: "/cas-usage/cabinets-services",
    namespace: "useCases.services",
    flow: { from: ["outlook"], to: ["pennylane", "microsoft-teams"] },
    workflows: [
      { id: "triage", from: ["outlook"], to: ["microsoft-teams"] },
      { id: "extraction", from: ["gmail"], to: ["pennylane"] },
      { id: "chase", from: ["excel"], to: ["outlook"] },
      { id: "reporting", from: ["pennylane", "google-sheets"], to: ["gmail"] },
    ],
    offers: ["audit-ia", "automation", "sprint-ia"],
    anchor: "audit-ia",
    quoteOffer: "automation",
    proof: { kind: "none", href: "/services/audit-ia" },
    tools: [TOOLS.outlook, TOOLS.pennylane, TOOLS.excel, TOOLS.teams],
  },
};

export const SECTOR_KEYS = Object.keys(sectorPages) as SectorKey[];

export const COMMON_TASKS: SectorWorkflow[] = [
  { id: "quotes", from: ["gmail"], to: ["google-sheets"] },
  { id: "invoices", from: ["pennylane"], to: ["gmail"] },
  { id: "inbox", from: ["outlook"], to: ["microsoft-teams"] },
  { id: "whatsapp", from: ["whatsapp", "notion"], to: ["hubspot"] },
];
