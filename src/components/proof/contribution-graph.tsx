import type { GithubContributions } from "@/lib/proof";

const CELL = 10;
const GAP = 3;
const LEVEL_FILLS = [
  "var(--surface-3)",
  "color-mix(in srgb, var(--accent) 28%, var(--surface-3))",
  "color-mix(in srgb, var(--accent) 52%, var(--surface-3))",
  "color-mix(in srgb, var(--accent) 76%, var(--surface-3))",
  "var(--accent)",
];

export const ACCENT_LEVEL_FILLS = [
  "rgb(245 78 0 / 0.08)",
  "rgb(245 78 0 / 0.22)",
  "rgb(245 78 0 / 0.45)",
  "rgb(245 78 0 / 0.7)",
  "var(--accent)",
];

export function ContributionGraph({
  data,
  label,
  fills = LEVEL_FILLS,
  cell = CELL,
}: {
  data: GithubContributions;
  label: string;
  fills?: string[];
  cell?: number;
}) {
  const offset = new Date(`${data.from}T00:00:00Z`).getUTCDay();
  const weeks = Math.ceil((data.levels.length + offset) / 7);
  const step = cell + GAP;
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
            width={cell}
            height={cell}
            rx={2}
            fill={fills[level]}
          />
        );
      })}
    </svg>
  );
}
