import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";

const LIGHTHOUSE = "lighthouse@12.8.2";
const PATHS = ["/", "/services/agents-ia", "/tarifs", "/cas-usage/immobilier"];
const LIVE_ORIGIN = "https://klyx.fr";
const REPORT_DIR = "docs/lighthouse";
const PROOF_FILE = "src/lib/proof/klyx-lighthouse.json";
const SUMMARY_FILE = join(REPORT_DIR, "summary.json");
const CATEGORIES = {
  performance: "performance",
  accessibility: "accessibility",
  bestPractices: "best-practices",
  seo: "seo",
};

const { values } = parseArgs({
  options: {
    base: { type: "string", default: "http://localhost:4318" },
    runs: { type: "string", default: "3" },
  },
});
const base = values.base.replace(/\/$/, "");
const runs = Number(values.runs);
if (!Number.isInteger(runs) || runs < 1 || runs % 2 === 0) {
  throw new Error(`--runs must be a positive odd integer, got ${values.runs}`);
}

function slugOf(path) {
  return path === "/" ? "home" : path.slice(1).replaceAll("/", "-");
}

function scoresOf(report) {
  return Object.fromEntries(
    Object.entries(CATEGORIES).map(([key, id]) => {
      const score = report.categories[id]?.score;
      if (typeof score !== "number") {
        throw new Error(`${report.finalDisplayedUrl}: no ${id} score`);
      }
      return [key, Math.round(score * 100)];
    }),
  );
}

function runOnce(url, output) {
  execFileSync(
    "npx",
    [
      "--yes",
      LIGHTHOUSE,
      url,
      "--output=json",
      `--output-path=${output}`,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--chrome-flags=--headless=new",
      "--quiet",
    ],
    { stdio: "inherit" },
  );
  return JSON.parse(readFileSync(output, "utf8"));
}

function medianRun(url, slug) {
  const reports = Array.from({ length: runs }, (_, i) => {
    const output = join(REPORT_DIR, `${slug}.run-${i}.json`);
    const report = runOnce(url, output);
    rmSync(output);
    return report;
  });
  reports.sort(
    (a, b) => a.categories.performance.score - b.categories.performance.score,
  );
  return reports[Math.floor(reports.length / 2)];
}

mkdirSync(REPORT_DIR, { recursive: true });
const date = new Date().toISOString().slice(0, 10);
const results = PATHS.map((path) => {
  const url = `${base}${path}`;
  const slug = slugOf(path);
  const report = medianRun(url, slug);
  writeFileSync(join(REPORT_DIR, `${slug}.json`), JSON.stringify(report));
  const scores = scoresOf(report);
  const lcp = report.audits["largest-contentful-paint"].displayValue;
  const tbt = report.audits["total-blocking-time"].displayValue;
  const cls = report.audits["cumulative-layout-shift"].displayValue;
  console.log(
    `${path}: ${JSON.stringify(scores)} LCP ${lcp} TBT ${tbt} CLS ${cls}`,
  );
  return { path, scores, lcp, tbt, cls };
});

writeFileSync(
  SUMMARY_FILE,
  `${JSON.stringify(
    {
      base,
      date,
      tool: `${LIGHTHOUSE}, mobile preset, median of ${runs}`,
      pages: results,
    },
    null,
    2,
  )}\n`,
);

const home = results.find((result) => result.path === "/");
const live = base === LIVE_ORIGIN;
writeFileSync(
  PROOF_FILE,
  `${JSON.stringify(
    {
      status: live ? "measured" : "local",
      url: `${base}/`,
      date,
      tool: `${LIGHTHOUSE}, mobile preset, median of ${runs}`,
      scores: home.scores,
    },
    null,
    2,
  )}\n`,
);
console.log(`wrote ${PROOF_FILE}`);
