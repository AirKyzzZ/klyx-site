import type { Translate } from "@/i18n/message-list";

import type { getPriceValues } from "./offers";
import type { StaticPathname } from "./scenarios";

type FaqSourceKey =
  | "home"
  | "sites"
  | "agents"
  | "fde"
  | "audit"
  | "automation"
  | "geo"
  | "pricing"
  | "bordeaux"
  | "realEstate"
  | "agencies"
  | "services"
  | "faqPage";

type FaqSource = {
  namespace: string;
  pathname: StaticPathname;
  navKey: string;
};

const SOURCES: Record<Exclude<FaqSourceKey, "faqPage">, FaqSource> = {
  home: { namespace: "home", pathname: "/", navKey: "home" },
  sites: {
    namespace: "sites",
    pathname: "/services/creation-site-web",
    navKey: "sites",
  },
  agents: {
    namespace: "agents",
    pathname: "/services/agents-ia",
    navKey: "agents",
  },
  fde: {
    namespace: "fde",
    pathname: "/forward-deployed-engineer",
    navKey: "fde",
  },
  audit: {
    namespace: "audit",
    pathname: "/services/audit-ia",
    navKey: "audit",
  },
  automation: {
    namespace: "automation",
    pathname: "/services/automatisation-ia",
    navKey: "automation",
  },
  geo: {
    namespace: "geo",
    pathname: "/services/geo-referencement-ia",
    navKey: "geo",
  },
  pricing: { namespace: "pricing", pathname: "/tarifs", navKey: "pricing" },
  bordeaux: {
    namespace: "bordeaux",
    pathname: "/agence-ia-bordeaux",
    navKey: "bordeaux",
  },
  realEstate: {
    namespace: "useCases.realEstate",
    pathname: "/cas-usage/immobilier",
    navKey: "realEstate",
  },
  agencies: {
    namespace: "useCases.agencies",
    pathname: "/cas-usage/agences",
    navKey: "agencies",
  },
  services: {
    namespace: "useCases.services",
    pathname: "/cas-usage/cabinets-services",
    navKey: "services",
  },
};

const OWN_LINKS: Record<string, FaqSource> = {
  roi: SOURCES.audit,
  rgpd: SOURCES.audit,
  aiAct: SOURCES.audit,
  expertise: SOURCES.automation,
  useful: { namespace: "useCases", pathname: "/cas-usage", navKey: "useCases" },
  continuity: { namespace: "about", pathname: "/a-propos", navKey: "about" },
};

export type FaqThemeKey =
  "pricing" | "timing" | "data" | "ai" | "geo" | "fde" | "tech" | "bordeaux";

type FaqRef = [FaqSourceKey, string];

export const FAQ_THEMES: { key: FaqThemeKey; items: FaqRef[] }[] = [
  {
    key: "pricing",
    items: [
      ["home", "price"],
      ["faqPage", "roi"],
      ["pricing", "final"],
      ["pricing", "sprintVsFde"],
      ["automation", "runCost"],
      ["agents", "bpifrance"],
      ["audit", "next"],
      ["automation", "upgrade"],
    ],
  },
  {
    key: "timing",
    items: [
      ["sites", "delay"],
      ["audit", "duration"],
      ["bordeaux", "delay"],
      ["geo", "delay"],
    ],
  },
  {
    key: "data",
    items: [
      ["home", "data"],
      ["faqPage", "rgpd"],
      ["faqPage", "aiAct"],
      ["services", "secret"],
      ["realEstate", "errors"],
    ],
  },
  {
    key: "ai",
    items: [
      ["faqPage", "useful"],
      ["home", "production"],
      ["agents", "agentVsAutomation"],
      ["automation", "vsSprint"],
      ["automation", "errors"],
      ["agents", "maintenance"],
      ["faqPage", "expertise"],
      ["audit", "pme"],
      ["audit", "deliverable"],
      ["audit", "noTech"],
      ["agents", "nothingFound"],
      ["realEstate", "replace"],
      ["realEstate", "portals"],
      ["services", "software"],
      ["services", "staff"],
    ],
  },
  {
    key: "geo",
    items: [
      ["geo", "whatIs"],
      ["geo", "guarantee"],
      ["geo", "vsSeo"],
      ["geo", "platforms"],
      ["geo", "citeme"],
    ],
  },
  {
    key: "fde",
    items: [
      ["fde", "vsFreelance"],
      ["fde", "minimum"],
      ["fde", "days"],
      ["fde", "remote"],
      ["fde", "vsSprint"],
    ],
  },
  {
    key: "tech",
    items: [
      ["home", "stack"],
      ["sites", "stack"],
      ["agents", "tools"],
      ["automation", "tools"],
      ["sites", "content"],
      ["sites", "ownership"],
      ["sites", "after"],
      ["faqPage", "continuity"],
      ["agencies", "meetings"],
      ["agencies", "maintenance"],
      ["agencies", "capacity"],
    ],
  },
  {
    key: "bordeaux",
    items: [
      ["home", "remote"],
      ["home", "team"],
      ["bordeaux", "it"],
    ],
  },
];

export type FaqPageItem = {
  id: string;
  question: string;
  answer: string;
  source: { pathname: StaticPathname; navKey: string };
};

function sourceOf(ref: FaqRef): FaqSource {
  const [key, item] = ref;
  if (key !== "faqPage") return SOURCES[key];
  const own = OWN_LINKS[item];
  if (!own) throw new Error(`No link for faqPage.items.${item}`);
  return own;
}

export function faqAnchor([key, item]: FaqRef): string {
  return `${key}-${item}`.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

export function faqThemes(
  root: Translate,
  prices: ReturnType<typeof getPriceValues>,
): { key: FaqThemeKey; items: FaqPageItem[] }[] {
  return FAQ_THEMES.map((theme) => ({
    key: theme.key,
    items: theme.items.map((ref) => {
      const [key, item] = ref;
      const namespace = key === "faqPage" ? "faqPage" : SOURCES[key].namespace;
      const path = `${namespace}.faq.items.${item}`;
      const source = sourceOf(ref);
      return {
        id: faqAnchor(ref),
        question: root(`${path}.question`, prices),
        answer: root(`${path}.answer`, prices),
        source: { pathname: source.pathname, navKey: source.navKey },
      };
    }),
  }));
}

export function faqPageItems(
  root: Translate,
  prices: ReturnType<typeof getPriceValues>,
): FaqPageItem[] {
  return faqThemes(root, prices).flatMap((theme) => theme.items);
}
