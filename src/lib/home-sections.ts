import type { CaseStudyMeta } from "@/lib/content";
import { getSiteShot } from "@/lib/proof";

const HOME_CASE_COUNT = 3;

export const HOME_OFFER_CARDS = [
  { key: "sites", href: "/services/creation-site-web", offer: "landing" },
  { key: "agents", href: "/services/agents-ia", offer: "sprint-ia" },
  { key: "fde", href: "/forward-deployed-engineer", offer: "fde" },
] as const;

export const ALSO_OFFERS = [
  { key: "audit", href: "/services/agents-ia" },
  { key: "automation", href: "/services/agents-ia" },
  { key: "geo", href: "/services/creation-site-web" },
] as const;

export function selectHomeCases(cases: CaseStudyMeta[]): CaseStudyMeta[] {
  return cases
    .filter((study) => getSiteShot(study.slug) !== null)
    .slice(0, HOME_CASE_COUNT);
}
