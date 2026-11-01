import type { GithubContributions } from "@/lib/proof";

const CELL = 10;
const GAP = 3;
const LEVEL_FILLS = [
  "var(--surface-3)",
  "rgb(237 232 222 / 0.22)",
  "rgb(237 232 222 / 0.45)",
  "rgb(237 232 222 / 0.7)",
  "var(--accent)",
];

export function ContributionGraph({
  data,
  label,
}: {
  data: GithubContributions;
  label: string;
}) {
  const offset = new Date(`${data.from}T00:00:00Z`).getUTCDay();
  const weeks = Math.ceil((data.levels.length + offset) / 7);
  const step = CELL + GAP;
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${weeks * step - GAP} ${7 * step - GAP}`}
      className="h-auto w-full"
    >
      {data.levels.map((level, i) => {
        const slot = i + offset;
        return (
          <rect
            key={i}
            x={Math.floor(slot / 7) * step}
            y={(slot % 7) * step}
            width={CELL}
            height={CELL}
            rx={2}
            fill={LEVEL_FILLS[level]}
          />
        );
      })}
    </svg>
  );
}
