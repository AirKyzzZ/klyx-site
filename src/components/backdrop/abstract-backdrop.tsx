import { type CSSProperties, useId } from "react";

import type { AbstractBackdropVariant } from "@/lib/hero-backdrop";
import { cn } from "@/lib/utils";

import "./backdrop.css";

const NODES = [
  [80, 80],
  [280, 80],
  [280, 200],
  [480, 40],
  [720, 40],
  [960, 80],
  [1120, 80],
  [1120, 280],
  [1120, 520],
  [960, 520],
  [760, 560],
  [520, 560],
  [320, 480],
  [80, 400],
  [80, 560],
] as const;

const LIT_NODES = new Set([3, 7, 11]);

const WIRES = [
  "M80 80H280V200",
  "M280 80V40H720",
  "M720 40H960V80H1120V280",
  "M1120 280V520H960",
  "M960 520H760V560H520",
  "M520 560H320V480H80V400",
  "M80 400V560",
];

const PACKETS = [
  { x: 280, y: 40, dx: 440, dy: 0, duration: 7, delay: 0 },
  { x: 1120, y: 80, dx: 0, dy: 200, duration: 5, delay: 2 },
  { x: 960, y: 520, dx: -200, dy: 0, duration: 4, delay: 1 },
  { x: 320, y: 480, dx: -240, dy: 0, duration: 5, delay: 3 },
];

const FLOWS = [
  "M-20 40C360 40 520 242.8 760 253.2S1080 118 1220 53",
  "M-20 126.7C360 126.7 520 261.9 760 268.8S1080 178.7 1220 135.3",
  "M-20 213.3C360 213.3 520 280.9 760 284.4S1080 239.3 1220 217.7",
  "M-20 300C360 300 520 300 760 300S1080 300 1220 300",
  "M-20 386.7C360 386.7 520 319.1 760 315.6S1080 360.7 1220 382.3",
  "M-20 473.4C360 473.4 520 338.1 760 331.2S1080 421.3 1220 464.7",
  "M-20 560C360 560 520 357.2 760 346.8S1080 482 1220 547",
];

const FLOW_PACKETS = [
  { path: 1, duration: 9, delay: 0 },
  { path: 3, duration: 7, delay: 2.5 },
  { path: 5, duration: 11, delay: 5 },
];

const timing = (duration: number, delay: number) =>
  ({ "--bd-dur": `${duration}s`, "--bd-delay": `${delay}s` }) as CSSProperties;

function Constellation() {
  const gridId = useId();
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern
          id={gridId}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path d="M40 0H0V40" className="bd-gridline" />
        </pattern>
      </defs>
      <rect width="1200" height="600" fill={`url(#${gridId})`} />
      {WIRES.map((d) => (
        <path key={d} d={d} className="bd-wire" />
      ))}
      {NODES.map(([x, y], i) => (
        <rect
          key={`${x}-${y}`}
          x={x - 5}
          y={y - 5}
          width="10"
          height="10"
          rx="2"
          className="bd-node"
          data-lit={LIT_NODES.has(i) || undefined}
        />
      ))}
      {PACKETS.map(({ x, y, dx, dy, duration, delay }) => (
        <g
          key={`${x}-${y}`}
          className="bd-packet"
          style={
            {
              ...timing(duration, delay),
              "--bd-dx": `${dx}px`,
              "--bd-dy": `${dy}px`,
            } as CSSProperties
          }
        >
          <circle cx={x} cy={y} r="9" className="bd-packet-glow" />
          <circle cx={x} cy={y} r="3" />
        </g>
      ))}
    </svg>
  );
}

function FlowLines() {
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
      {FLOWS.map((d) => (
        <path key={d} d={d} className="bd-flow" />
      ))}
      {FLOW_PACKETS.map(({ path, duration, delay }) => (
        <path
          key={path}
          d={FLOWS[path]}
          pathLength={100}
          className="bd-flow-packet"
          style={timing(duration, delay)}
        />
      ))}
    </svg>
  );
}

export function AbstractBackdrop({
  variant,
  className,
}: {
  variant: AbstractBackdropVariant;
  className?: string;
}) {
  return (
    <div
      className={cn("bd", className)}
      data-backdrop={variant}
      aria-hidden="true"
    >
      {variant === "grid" && <Constellation />}
      {variant === "flow" && <FlowLines />}
    </div>
  );
}
