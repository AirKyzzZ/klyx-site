import prListData from "./citeme-prs.json";
import contributionsData from "./github-contributions.json";
import lighthouseData from "./klyx-lighthouse.json";
import runLogData from "./run-log.json";
import siteShotsData from "./site-shots.json";

export type LighthouseScores = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
};

export type ProofSource =
  | { kind: "lighthouse"; url: string; date: string; scores: LighthouseScores }
  | {
      kind: "pr-list";
      repo: string;
      items: {
        title: string;
        number: number;
        mergedAt: string;
        href: string;
      }[];
    }
  | {
      kind: "run-log";
      title: string;
      rows: { t: string; text: string; tone?: "ok" | "err" | "dim" }[];
      anonymised: true;
    }
  | { kind: "site-shot"; slug: string; url: string; image: string };

export type ProofKind = ProofSource["kind"];

const STRIP_ORDER: ProofKind[] = [
  "lighthouse",
  "pr-list",
  "run-log",
  "site-shot",
];
const SCORE_KEYS = [
  "performance",
  "accessibility",
  "bestPractices",
  "seo",
] as const;
const TONES = ["ok", "err", "dim"] as const;
const LIVE_HOST = "klyx.fr";

type Data = Record<string, unknown>;

function isRecord(value: unknown): value is Data {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isHttps(value: unknown): value is string {
  return isText(value) && value.startsWith("https://");
}

function isScore(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value <= 100;
}

function hasStatus(data: unknown, status: string): data is Data {
  return isRecord(data) && data.status === status;
}

function isLiveKlyx(value: unknown): value is string {
  return isHttps(value) && new URL(value).hostname === LIVE_HOST;
}

export function verifyLighthouse(data: unknown): ProofSource | null {
  if (!hasStatus(data, "measured")) return null;
  const { url, date, scores } = data;
  if (!isLiveKlyx(url) || !isText(date) || !isRecord(scores)) return null;
  if (!SCORE_KEYS.every((key) => isScore(scores[key]))) return null;
  return {
    kind: "lighthouse",
    url,
    date,
    scores: {
      performance: Number(scores.performance),
      accessibility: Number(scores.accessibility),
      bestPractices: Number(scores.bestPractices),
      seo: Number(scores.seo),
    },
  };
}

type PrItem = Extract<ProofSource, { kind: "pr-list" }>["items"][number];
type RunRow = Extract<ProofSource, { kind: "run-log" }>["rows"][number];

function isPr(item: unknown): item is PrItem {
  return (
    isRecord(item) &&
    isText(item.title) &&
    typeof item.number === "number" &&
    isText(item.mergedAt) &&
    isHttps(item.href)
  );
}

export function verifyPrList(data: unknown): ProofSource | null {
  if (!hasStatus(data, "confirmed")) return null;
  const { repo, items } = data;
  if (!isText(repo) || !Array.isArray(items) || items.length === 0) return null;
  const prs: unknown[] = items;
  if (!prs.every(isPr)) return null;
  return { kind: "pr-list", repo, items: prs };
}

function isRow(row: unknown): row is RunRow {
  if (!isRecord(row) || !isText(row.t) || !isText(row.text)) return false;
  return row.tone === undefined || TONES.some((tone) => tone === row.tone);
}

export function verifyRunLog(data: unknown): ProofSource | null {
  if (!hasStatus(data, "confirmed") || data.anonymised !== true) return null;
  const { title, rows } = data;
  if (!isText(title) || !Array.isArray(rows) || rows.length === 0) return null;
  const entries: unknown[] = rows;
  if (!entries.every(isRow)) return null;
  return { kind: "run-log", title, rows: entries, anonymised: true };
}

export function verifySiteShots(data: unknown): ProofSource[] {
  if (!Array.isArray(data)) return [];
  return data.flatMap((entry): ProofSource[] => {
    if (!isRecord(entry) || !isText(entry.slug) || !isHttps(entry.url)) {
      return [];
    }
    return [
      {
        kind: "site-shot",
        slug: entry.slug,
        url: entry.url,
        image: `/realisations/${entry.slug}-1440.png`,
      },
    ];
  });
}

export function isVerified(source: ProofSource): boolean {
  switch (source.kind) {
    case "lighthouse":
      return verifyLighthouse({ ...source, status: "measured" }) !== null;
    case "pr-list":
      return verifyPrList({ ...source, status: "confirmed" }) !== null;
    case "run-log":
      return verifyRunLog({ ...source, status: "confirmed" }) !== null;
    case "site-shot":
      return verifySiteShots([source]).length === 1;
  }
}

export function getVerifiedProof(): ProofSource[] {
  return [
    verifyLighthouse(lighthouseData),
    verifyPrList(prListData),
    verifyRunLog(runLogData),
    ...verifySiteShots(siteShotsData),
  ].filter((source): source is ProofSource => source !== null);
}

export function getSiteShot(slug: string) {
  const shot = getVerifiedProof().find(
    (source) => source.kind === "site-shot" && source.slug === slug,
  );
  return shot?.kind === "site-shot" ? shot : null;
}

export function selectStripProof(sources: ProofSource[]): ProofSource[] {
  return STRIP_ORDER.flatMap((kind) => {
    const first = sources.find((source) => source.kind === kind);
    return first ? [first] : [];
  });
}

export type GithubContributions = {
  user: string;
  capturedAt: string;
  from: string;
  to: string;
  total: number;
  levels: number[];
};

export function verifyContributions(data: unknown): GithubContributions | null {
  if (!hasStatus(data, "measured")) return null;
  const { user, capturedAt, from, to, total, levels } = data;
  if (![user, capturedAt, from, to].every(isText)) return null;
  if (typeof total !== "number" || typeof levels !== "string") return null;
  if (!/^[0-4]{360,371}$/.test(levels)) return null;
  return {
    user: String(user),
    capturedAt: String(capturedAt),
    from: String(from),
    to: String(to),
    total,
    levels: [...levels].map(Number),
  };
}

export function getGithubContributions(): GithubContributions | null {
  return verifyContributions(contributionsData);
}
