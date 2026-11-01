import { readFileSync } from "node:fs";

const MIN_RATIO = 4.5;
const CSS_PATH = new URL("../src/app/globals.css", import.meta.url);

const DARK_SURFACES = [
  "bg",
  "bg-sunken",
  "surface-1",
  "surface-2",
  "surface-3",
];

const PAIRS = [
  ...["text", "text-2", "text-3"].flatMap((fg) =>
    DARK_SURFACES.map((bg) => [fg, bg]),
  ),
  ...DARK_SURFACES.filter((bg) => bg !== "surface-3").map((bg) => [
    "accent",
    bg,
  ]),
  ["ink", "sand-50"],
  ["ink-2", "sand-50"],
  ["ink", "sand-200"],
  ["ink-2", "sand-200"],
  ["accent-ink", "accent"],
  ["accent-ink", "accent-hover"],
];

function readTokens(css) {
  const root = css.match(/:root\s*{([\s\S]*?)\n}/);
  if (!root) throw new Error(`No :root block found in ${CSS_PATH.pathname}`);
  return Object.fromEntries(
    [...root[1].matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map(
      ([, name, hex]) => [name, hex],
    ),
  );
}

function luminance(hex) {
  const channels = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  const [r, g, b] = channels.map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const tokens = readTokens(readFileSync(CSS_PATH, "utf8"));
const failures = [];

for (const [fg, bg] of PAIRS) {
  if (!tokens[fg] || !tokens[bg]) {
    throw new Error(
      `Missing hex token --${tokens[fg] ? bg : fg} in globals.css`,
    );
  }
  const ratio = contrast(tokens[fg], tokens[bg]);
  const ok = ratio >= MIN_RATIO;
  console.log(
    `${ok ? "ok  " : "FAIL"} --${fg} on --${bg}: ${ratio.toFixed(2)}:1 (${tokens[fg]} / ${tokens[bg]})`,
  );
  if (!ok) failures.push(`--${fg} on --${bg}`);
}

if (failures.length > 0) {
  console.error(
    `\n${failures.length} pair(s) under ${MIN_RATIO}:1: ${failures.join(", ")}`,
  );
  process.exit(1);
}

console.log(`\nAll ${PAIRS.length} pairs are at least ${MIN_RATIO}:1.`);
