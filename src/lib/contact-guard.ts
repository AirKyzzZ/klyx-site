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
  return allowRequest(limiterKey(ip)) ? null : "rate-limited";
}

export function clientIp(headers: Pick<Headers, "get">): string {
  const netlify = headers.get("x-nf-client-connection-ip")?.trim();
  if (netlify) return netlify;
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function ipv6Hextets(ip: string): number[] | null {
  const address = ip.split("%")[0].replace(/^\[|\]$/g, "");
  const dotted = /^(.*:)(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(
    address,
  );
  const octets = dotted?.slice(2).map(Number);
  if (octets?.some((octet) => octet > 255)) return null;
  const hex = octets
    ? `${dotted?.[1]}${((octets[0] << 8) | octets[1]).toString(16)}:${((octets[2] << 8) | octets[3]).toString(16)}`
    : address;

  const parts = hex.split("::");
  if (parts.length > 2) return null;
  const [head, tail] = parts.map((part) => (part ? part.split(":") : []));
  const missing = 8 - head.length - (tail?.length ?? 0);
  if (tail ? missing < 1 : missing !== 0) return null;
  const groups = [
    ...head,
    ...Array<string>(missing).fill("0"),
    ...(tail ?? []),
  ];
  if (!groups.every((group) => /^[\da-f]{1,4}$/i.test(group))) return null;
  return groups.map((group) => parseInt(group, 16));
}

function mappedIpv4(hextets: number[]): string | null {
  const isMapped =
    hextets.slice(0, 5).every((group) => group === 0) && hextets[5] === 0xffff;
  if (!isMapped) return null;
  const [high, low] = hextets.slice(6);
  return [high >> 8, high & 255, low >> 8, low & 255].join(".");
}

function ipv6Prefix(hextets: number[], groups: number): string {
  const prefix = hextets
    .slice(0, groups)
    .map((group) => group.toString(16))
    .join(":");
  return `${prefix}::/${groups * 16}`;
}

export function limiterKey(ip: string): string {
  const hextets = ipv6Hextets(ip);
  if (!hextets) return ip;
  return mappedIpv4(hextets) ?? ipv6Prefix(hextets, 4);
}

export function maskIp(ip: string): string {
  const hextets = ipv6Hextets(ip);
  const ipv4 = hextets ? mappedIpv4(hextets) : ip;
  if (hextets && !ipv4) return ipv6Prefix(hextets, 3);
  const octets = (ipv4 ?? ip).split(".");
  if (octets.length !== 4) return ip;
  return `${octets.slice(0, 3).join(".")}.0/24`;
}
