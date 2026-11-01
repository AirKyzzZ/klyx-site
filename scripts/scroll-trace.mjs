import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

import { chromium } from "playwright";

const LONG_TASK_MS = 50;
const SCROLL_MS = 6000;

const { values } = parseArgs({
  options: {
    base: { type: "string", default: "http://localhost:4318" },
    path: { type: "string", default: "/" },
    out: { type: "string" },
  },
});

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const cdp = await page.context().newCDPSession(page);
await page.goto(`${values.base}${values.path}`, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1000);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

await browser.startTracing(page, {
  categories: ["devtools.timeline", "disabled-by-default-devtools.timeline"],
});
const scroll = await page.evaluate(async (duration) => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const start = performance.now();
  return new Promise((resolve) => {
    const frame = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      scrollTo(0, max * progress);
      if (progress < 1) requestAnimationFrame(frame);
      else resolve({ max, elapsed: now - start });
    };
    requestAnimationFrame(frame);
  });
}, SCROLL_MS);
const buffer = await browser.stopTracing();
await browser.close();

const { traceEvents } = JSON.parse(buffer.toString());
const main = traceEvents.find(
  (event) =>
    event.name === "thread_name" && event.args?.name === "CrRendererMain",
);
const onMain = traceEvents.filter(
  (event) => event.pid === main?.pid && event.tid === main?.tid,
);
const durationMs = (event) => (event.dur ?? 0) / 1000;
const tasks = onMain.filter((event) => event.name === "RunTask");
const longTasks = tasks.filter((event) => durationMs(event) > LONG_TASK_MS);
const count = (name) => onMain.filter((event) => event.name === name).length;

const summary = {
  url: `${values.base}${values.path}`,
  viewport: "1440x900",
  cpuThrottling: 4,
  scrollPx: Math.round(scroll.max),
  scrollMs: Math.round(scroll.elapsed),
  tasks: tasks.length,
  longTasks: longTasks.map((event) => Math.round(durationMs(event))),
  maxTaskMs: Math.round(Math.max(0, ...tasks.map(durationMs))),
  layouts: count("Layout"),
  layoutMs: Math.round(
    onMain
      .filter((event) => event.name === "Layout")
      .reduce((sum, event) => sum + durationMs(event), 0),
  ),
  styleRecalcs: count("UpdateLayoutTree"),
  paints: count("Paint"),
};

console.log(JSON.stringify(summary, null, 2));
if (values.out)
  writeFileSync(values.out, `${JSON.stringify(summary, null, 2)}\n`);
if (longTasks.length > 0) process.exitCode = 1;
