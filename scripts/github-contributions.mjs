import { writeFileSync } from "node:fs";

const USER = "AirKyzzZ";
const OUT = "src/lib/proof/github-contributions.json";
const DAY =
  /data-date="(\d{4}-\d{2}-\d{2})" id="(contribution-day-component-\d+-\d+)"/g;
const TIP =
  /for="(contribution-day-component-\d+-\d+)"[^>]*>(No|\d+) contributions?/g;

const response = await fetch(`https://github.com/users/${USER}/contributions`);
if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
const html = await response.text();

const counts = new Map(
  [...html.matchAll(TIP)].map(([, id, n]) => [id, n === "No" ? 0 : Number(n)]),
);
const days = [...html.matchAll(DAY)]
  .map(([, date, id]) => ({
    date,
    count: counts.get(id),
  }))
  .sort((a, b) => a.date.localeCompare(b.date));

if (days.length < 360 || days.some((day) => day.count === undefined)) {
  throw new Error(`Unexpected contribution markup (${days.length} days)`);
}

const active = days
  .map((day) => day.count)
  .filter((count) => count > 0)
  .sort((a, b) => a - b);
const quartile = (q) => active[Math.floor(active.length * q)] ?? 0;
const levelOf = (count) => {
  if (count === 0) return 0;
  if (count <= quartile(0.25)) return 1;
  if (count <= quartile(0.5)) return 2;
  if (count <= quartile(0.75)) return 3;
  return 4;
};

writeFileSync(
  OUT,
  `${JSON.stringify(
    {
      status: "measured",
      user: USER,
      capturedAt: new Date().toISOString().slice(0, 10),
      from: days[0].date,
      to: days.at(-1).date,
      total: days.reduce((sum, day) => sum + day.count, 0),
      levels: days.map((day) => levelOf(day.count)).join(""),
    },
    null,
    2,
  )}\n`,
);
console.log(`${OUT}: ${days.length} days`);
