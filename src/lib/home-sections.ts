import type { CaseStudyMeta } from "@/lib/content";
const FEATURED_CASE_SLUGS = [
  "cronolyss",
  "citeme",
  "hop-hop-immo",
  "2060-io",
  "pkba",
];

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

export function selectFeaturedCases(cases: CaseStudyMeta[]): CaseStudyMeta[] {
  return FEATURED_CASE_SLUGS.flatMap((slug) =>
    cases.filter((study) => study.slug === slug),
  );
}
