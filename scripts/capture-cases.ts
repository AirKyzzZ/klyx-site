import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "content/realisations");
const OUTPUT_DIR = path.join(ROOT, "public/realisations");
const MANIFEST = path.join(ROOT, "src/lib/proof/site-shots.json");
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
] as const;
const SETTLE_MS = 2500;

type Target = { slug: string; url: string };
type Shot = { slug: string; url: string; capturedAt: string };

function readTargets(): Target[] {
  return readdirSync(CASES_DIR)
    .filter((file) => file.endsWith(".fr.mdx"))
    .flatMap((file) => {
      const source = readFileSync(path.join(CASES_DIR, file), "utf8");
      const url = source.match(/url:\s*"([^"]+)"/)?.[1];
      if (!url) return [];
      return [{ slug: file.replace(/\.fr\.mdx$/, ""), url }];
    });
}

function hideConsentBanners() {
  const consent = /cookie|vie privée|privacy|consent/i;
  for (const element of document.querySelectorAll<HTMLElement>("body *")) {
    const { position } = getComputedStyle(element);
    if (position !== "fixed" && position !== "sticky") continue;
    if (element.tagName === "HEADER" || element.querySelector("nav")) continue;
    const text = element.textContent?.trim() ?? "";
    const { width, height } = element.getBoundingClientRect();
    const scrim =
      text === "" && width * height > 0.8 * innerWidth * innerHeight;
    if (scrim || consent.test(text)) element.style.display = "none";
  }
}

async function capture(target: Target): Promise<Shot> {
  const browser = await chromium.launch();
  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const response = await page.goto(target.url, {
        waitUntil: "load",
        timeout: 30_000,
      });
      if (!response || response.status() >= 400) {
        throw new Error(`HTTP ${response?.status() ?? "no response"}`);
      }
      await page.waitForTimeout(SETTLE_MS);
      await page.evaluate(hideConsentBanners);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${target.slug}-${viewport.width}.png`),
      });
      await context.close();
    }
  } finally {
    await browser.close();
  }
  return {
    slug: target.slug,
    url: target.url,
    capturedAt: new Date().toISOString().slice(0, 10),
  };
}

const shots: Shot[] = [];
const failures: string[] = [];

for (const target of readTargets()) {
  try {
    shots.push(await capture(target));
    console.log(`ok   ${target.slug} ${target.url}`);
  } catch (error) {
    const reason = error instanceof Error ? error.message.split("\n")[0] : "";
    failures.push(`${target.slug} ${target.url}: ${reason}`);
    console.log(`skip ${target.slug} ${target.url}: ${reason}`);
  }
}

writeFileSync(MANIFEST, `${JSON.stringify(shots, null, 2)}\n`);
console.log(`\n${shots.length} captured, ${failures.length} skipped`);
for (const failure of failures) console.log(`  ${failure}`);
