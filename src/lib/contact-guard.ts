const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_TRACKED_KEYS = 10_000;
export const MIN_FILL_MS = 3000;

export type ContactBlockReason = "too-fast" | "rate-limited";

export function createSlidingWindowLimiter({
  limit,
  windowMs,
  maxKeys,
}: {
  limit: number;
  windowMs: number;
  maxKeys: number;
}) {
  const hits = new Map<string, number[]>();

  return function allow(key: string, now = Date.now()): boolean {
    const recent = (hits.get(key) ?? []).filter((at) => at > now - windowMs);
    const allowed = recent.length < limit;
    if (allowed) recent.push(now);
    hits.delete(key);
    hits.set(key, recent);
    if (hits.size > maxKeys) hits.delete(hits.keys().next().value as string);
    return allowed;
  };
}

const allowRequest = createSlidingWindowLimiter({
  limit: MAX_REQUESTS_PER_WINDOW,
  windowMs: WINDOW_MS,
  maxKeys: MAX_TRACKED_KEYS,
});

export function filledTooFast(fillMs: FormDataEntryValue | null): boolean {
  if (typeof fillMs !== "string" || fillMs.trim() === "") return true;
  const elapsed = Number(fillMs);
  return !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS;
}

export function checkContactRequest(
  ip: string,
  fillMs: FormDataEntryValue | null,
): ContactBlockReason | null {
  if (filledTooFast(fillMs)) return "too-fast";
  return allowRequest(ip) ? null : "rate-limited";
}

export function clientIp(headers: Pick<Headers, "get">): string {
  const netlify = headers.get("x-nf-client-connection-ip")?.trim();
  if (netlify) return netlify;
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function maskIp(ip: string): string {
  if (ip.includes(":")) return `${ip.split(":").slice(0, 3).join(":")}::/48`;
  const octets = ip.split(".");
  if (octets.length !== 4) return ip;
  return `${octets.slice(0, 3).join(".")}.0/24`;
}
