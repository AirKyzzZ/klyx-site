import type { CSSProperties } from "react";

import { BRAND_COLORS } from "@/components/logos/brand-colors";
import { ToolLogo } from "@/components/logos/tool-logo";
import type { ToolLogoId } from "@/lib/tools";
import { cn } from "@/lib/utils";

import "./ui-kit.css";

type Point = { x: number; y: number };
type Slot = Point & {
  size: number;
  rotate: number;
  far?: boolean;
  via?: Point;
};
type Side = { slots: Slot[]; node: Point; extra?: Point[] };

const LEFT: Side = {
  node: { x: 21.75, y: 53.8 },
  extra: [{ x: 19.2, y: 43.4 }],
  slots: [
    { x: 6.9, y: 32.1, size: 56, rotate: -7 },
    { x: 16.2, y: 45.7, size: 46, rotate: 5 },
    { x: -0.65, y: 47.3, size: 36, rotate: 11, far: true },
    { x: 3.7, y: 63.7, size: 50, rotate: 4, via: { x: 15.2, y: 57.8 } },
    { x: 13.9, y: 79.2, size: 42, rotate: -9 },
  ],
};

const RIGHT: Side = {
  node: { x: 78.25, y: 53.8 },
  slots: [
    { x: 92, y: 29.9, size: 50, rotate: 8 },
    { x: 83, y: 48.3, size: 56, rotate: -5, via: { x: 79.4, y: 51.6 } },
    { x: 99.4, y: 52.3, size: 34, rotate: -12, far: true },
    { x: 94.5, y: 67.9, size: 44, rotate: -8, via: { x: 80.3, y: 67.9 } },
    { x: 84.9, y: 81.9, size: 48, rotate: 6 },
  ],
};

function wire(from: Point, to: Point) {
  const mid = from.x + (to.x - from.x) * 0.6;
  return `M ${from.x} ${from.y} C ${mid} ${from.y}, ${to.x} ${from.y + (to.y - from.y) * 0.4}, ${to.x} ${to.y}`;
}

const at = ({ x, y }: Point): CSSProperties => ({
  left: `${x}%`,
  top: `${y}%`,
});

export function ConstellationBackdrop({
  sources,
  destinations,
  className,
}: {
  sources: ToolLogoId[];
  destinations: ToolLogoId[];
  className?: string;
}) {
  const sides = [
    { side: LEFT, logos: sources },
    { side: RIGHT, logos: destinations },
  ].map(({ side, logos }) => ({
    node: side.node,
    extra: side.extra ?? [],
    slots: side.slots.slice(0, logos.length).map((slot, i) => ({
      ...slot,
      logo: logos[i],
    })),
  }));
  const dots = sides.flatMap(({ node, slots, extra }) => [
    { ...node, node: true },
    ...slots.flatMap((slot) => (slot.via ? [{ ...slot.via, node: false }] : [])),
    ...extra.map((dot) => ({ ...dot, node: false })),
  ]);

  return (
    <div
      aria-hidden="true"
      data-constellation
      className={cn(
        "constellation pointer-events-none absolute inset-0",
        className,
      )}
    >
      <div className="constellation-grid absolute inset-0" />
      <div className="absolute inset-0 max-lg:hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          {sides.flatMap(({ node, slots }) =>
            slots
              .filter((slot) => !slot.far)
              .map((slot) => (
                <path
                  key={slot.logo}
                  d={wire(slot, node)}
                  className="constellation-wire"
                  vectorEffect="non-scaling-stroke"
                />
              )),
          )}
        </svg>
        {dots.map((dot, i) => (
          <span
            key={`${dot.x}-${dot.y}`}
            className={cn(
              "constellation-dot",
              dot.node && "constellation-dot--node",
            )}
            style={{ ...at(dot), "--pulse-delay": `${i * 0.6}s` } as CSSProperties}
          />
        ))}
        {sides.flatMap(({ slots }, side) =>
          slots.map((slot, i) => {
            const index = side * 5 + i;
            return (
              <span
                key={slot.logo}
                className="constellation-logo"
                style={
                  {
                    ...at(slot),
                    "--float-duration": `${5 + ((index * 7) % 5) * 0.7}s`,
                    "--float-delay": `${-((index * 13) % 7) * 0.8}s`,
                  } as CSSProperties
                }
              >
                <span
                  className={cn(
                    "constellation-tile",
                    slot.far && "constellation-tile--far",
                  )}
                  style={{
                    width: slot.size,
                    height: slot.size,
                    rotate: `${slot.rotate}deg`,
                    color: BRAND_COLORS[slot.logo],
                  }}
                >
                  <ToolLogo
                    logo={slot.logo}
                    size={Math.round(slot.size * 0.46)}
                  />
                </span>
              </span>
            );
          }),
        )}
      </div>
    </div>
  );
}
