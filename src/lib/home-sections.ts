import type { CaseStudyMeta } from "@/lib/content";
import {
  CONNECTED_TOOLS,
  TOOLS,
  type Tool,
  type ToolLogoId,
} from "@/lib/tools";

const HOME_CASE_SLUGS = [
  "cronolyss",
  "citeme",
  "hop-hop-immo",
  "2060-io",
  "pkba",
];

export const HOME_CLIENTS = [
  "Cronolyss",
  "Hop Hop Immo",
  "2060.io",
  "PKBA",
] as const;

export const HERO_SOURCES: ToolLogoId[] = [
  "gmail",
  "outlook",
  "notion",
  "google-sheets",
  "shopify",
];

export const HERO_DESTINATIONS: ToolLogoId[] = [
  "hubspot",
  "slack",
  "openai",
  "microsoft-teams",
  "pennylane",
];

export const HOME_TOOLS: Tool[] = [
  TOOLS.gmail,
  TOOLS.googleSheets,
  TOOLS.hubspot,
  TOOLS.slack,
  TOOLS.notion,
  TOOLS.shopify,
  { ...TOOLS.whatsapp, name: "WhatsApp" },
  TOOLS.stripe,
];

export const OTHER_TOOL_COUNT =
  CONNECTED_TOOLS.flatMap((group) => group.tools).length - HOME_TOOLS.length;

export const HOME_OFFER_CARDS = [
  { key: "sites", href: "/services/creation-site-web", offer: "landing" },
  { key: "agents", href: "/services/agents-ia", offer: "sprint-ia" },
  { key: "fde", href: "/forward-deployed-engineer", offer: "fde" },
] as const;

export const ALSO_OFFERS = [
  { key: "audit", href: "/services/audit-ia" },
  { key: "automation", href: "/services/automatisation-ia" },
  { key: "geo", href: "/services/geo-referencement-ia" },
  { key: "useCases", href: "/cas-usage" },
] as const;

export const HOME_USE_CASES = [
  { key: "sales", from: ["gmail"], to: ["hubspot", "slack"] },
  { key: "support", from: ["gmail"], to: ["notion", "slack"] },
  { key: "finance", from: ["gmail"], to: ["pennylane", "slack"] },
  {
    key: "management",
    from: ["google-sheets"],
    to: ["notion", "microsoft-teams"],
  },
] as const satisfies readonly {
  key: string;
  from: readonly ToolLogoId[];
  to: readonly ToolLogoId[];
}[];

export const HOME_CAROUSEL = [
  { key: "cronolyss", slug: "cronolyss", image: "/realisations/cronolyss.png" },
  { key: "citeme", slug: "citeme", image: "/realisations/citeme-1440.png" },
  {
    key: "hoppy",
    slug: "hop-hop-immo",
    image: "/realisations/hop-hop-immo-assistant-1440.png",
  },
] as const;

export const HOME_FAQ = ["price", "tools", "data", "team", "remote"] as const;

export const HOME_TRUST = [
  "owned",
  "training",
  "europe",
  "human",
  "log",
  "tested",
] as const;

export const HOME_CASE_ROWS = [
  { slug: "2060-io", name: "2060.io" },
  { slug: "pkba", name: "PKBA" },
] as const;

export function selectHomeCases(cases: CaseStudyMeta[]): CaseStudyMeta[] {
  return HOME_CASE_SLUGS.flatMap((slug) =>
    cases.filter((study) => study.slug === slug),
  );
}
