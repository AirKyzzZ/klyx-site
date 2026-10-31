import type { CaseStudyMeta } from "@/lib/content";
import { getSiteShot } from "@/lib/proof";

const HOME_CASE_COUNT = 3;

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
