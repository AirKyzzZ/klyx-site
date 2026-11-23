import type { OfferId } from "./offers";
import type { SectorWorkflow } from "./sector-pages";

export const BORDEAUX_EXAMPLES: SectorWorkflow[] = [
  { id: "wine", from: ["outlook"], to: ["excel"] },
  { id: "building", from: ["whatsapp"], to: ["google-sheets", "gmail"] },
  { id: "accounting", from: ["gmail"], to: ["pennylane", "google-sheets"] },
  { id: "realEstate", from: ["outlook"], to: ["hubspot", "google"] },
];

export const BORDEAUX_OFFERS: [OfferId, OfferId, OfferId] = [
  "audit-ia",
  "automation",
  "sprint-ia",
];

export const BORDEAUX_PLACES = [
  "bordeaux",
  "merignac",
  "pessac",
  "talence",
  "begles",
  "arcachon",
  "gironde",
  "remote",
] as const;

export const LOCAL_CASES = [
  "pkba",
  "vertiflow",
  "lady-gallery",
  "hop-hop-immo",
] as const;

export const BORDEAUX_BLOG_PILLAR = "integrer-ia-pme-methode";
