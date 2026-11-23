import type { Locale } from "@/i18n/routing";
import { getVerifiedProof } from "@/lib/proof";
import type { ToolLogoId } from "@/lib/tools";

export type LogTone = "ok" | "err";

export const AGENT_LOG: { key: string; at: number; tone?: LogTone }[] = [
  { key: "watch", at: 0 },
  { key: "classify", at: 0.41 },
  { key: "score", at: 0.66 },
  { key: "update", at: 0.7 },
  { key: "retry", at: 0.94, tone: "err" },
  { key: "updated", at: 1.38, tone: "ok" },
  { key: "post", at: 1.52 },
  { key: "done", at: 1.8, tone: "ok" },
];

export function formatSeconds(locale: Locale, value: number) {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export const LIGHTHOUSE_KEYS = [
  "performance",
  "accessibility",
  "bestPractices",
  "seo",
] as const;

export function getLighthouseProof() {
  const source = getVerifiedProof().find((item) => item.kind === "lighthouse");
  return source?.kind === "lighthouse" ? source : null;
}

export function pageSpeedUrl(url: string) {
  return `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`;
}

export function formatDay(locale: Locale, date: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(date));
}

export const FDE_DEFINITION_SLUG = "forward-deployed-engineer-definition";

export const AUDIT_COLUMNS = [
  "process",
  "hours",
  "offer",
  "risk",
  "when",
] as const;

export const AUTOMATION_EXAMPLES = [
  { key: "invoices", from: ["gmail"], to: ["pennylane"] },
  { key: "quotes", from: ["wordpress"], to: ["gmail"] },
  { key: "reminders", from: ["pennylane"], to: ["gmail"] },
] as const satisfies readonly {
  key: string;
  from: readonly ToolLogoId[];
  to: readonly ToolLogoId[];
}[];

export type GeoState = "cited" | "competitor" | "absent";

export const GEO_ENGINES = [
  "ChatGPT",
  "Perplexity",
  "Gemini",
  "AI Overviews",
] as const;

export const GEO_SAMPLE: { prompt: "a" | "b" | "c"; states: GeoState[] }[] = [
  { prompt: "a", states: ["cited", "cited", "competitor", "absent"] },
  { prompt: "b", states: ["competitor", "cited", "absent", "competitor"] },
  { prompt: "c", states: ["absent", "competitor", "absent", "absent"] },
];

export function geoSampleCount() {
  const all = GEO_SAMPLE.flatMap((row) => row.states);
  return {
    cited: all.filter((state) => state === "cited").length,
    total: all.length,
  };
}
