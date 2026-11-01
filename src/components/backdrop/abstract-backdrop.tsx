import { type CSSProperties, useId } from "react";

import type { AbstractBackdropVariant } from "@/lib/hero-backdrop";
import { cn } from "@/lib/utils";

import "./backdrop.css";

const NODES = [
  [800, 80],
  [960, 80],
  [960, 120],
  [1160, 80],
  [1160, 240],
  [1160, 440],
  [1160, 560],
  [40, 160],
  [40, 440],
  [40, 560],
  [200, 440],
  [200, 560],
  [440, 520],
  [600, 520],
] as const;

const LIT_NODES = new Set([0, 4, 12]);

const WIRES = [
  "M800 80H1160V560",
  "M960 80V120",
  "M40 160V560",
  "M40 440H200V560",
  "M200 440H440V520H600",
];

const PACKETS = [
  { x: 1160, y: 120, dx: 0, dy: 400, duration: 7, delay: 0 },
  { x: 820, y: 80, dx: 320, dy: 0, duration: 5, delay: 2 },
  { x: 40, y: 200, dx: 0, dy: 320, duration: 6, delay: 1 },
  { x: 220, y: 440, dx: 200, dy: 0, duration: 4, delay: 3 },
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
  { path: 1, duration: 4, delay: 0 },
  { path: 3, duration: 3.5, delay: 1.5 },
  { path: 5, duration: 4.5, delay: 3 },
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
  const gutterId = useId();
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <clipPath id={gutterId}>
          <rect x="1116" width="84" height="600" />
        </clipPath>
      </defs>
      {FLOWS.map((d) => (
        <path key={d} d={d} className="bd-flow" />
      ))}
      <g clipPath={`url(#${gutterId})`}>
        {FLOW_PACKETS.map(({ path, duration, delay }) => (
          <path
            key={path}
            d={FLOWS[path]}
            pathLength={100}
            className="bd-flow-packet"
            style={timing(duration, delay)}
          />
        ))}
      </g>
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
