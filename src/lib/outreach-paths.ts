export const OUTREACH_PATHS = [
  "/pour/agences",
  "/pour/startups-sprint-ia",
] as const;

export type OutreachPath = (typeof OUTREACH_PATHS)[number];

export function isOutreachPath(pathname: string): boolean {
  return pathname.startsWith("/pour/");
}
