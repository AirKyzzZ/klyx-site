import type { ReactNode } from "react";

import { AbstractBackdrop } from "@/components/backdrop/abstract-backdrop";
import { HERO_BACKDROP } from "@/lib/hero-backdrop";

const SIZES = "(min-width: 1280px) 1168px, 100vw";

function Painting({ priority }: { priority: boolean }) {
  return (
    <picture className="ls-backdrop">
      <source
        media="(max-width: 639px)"
        type="image/avif"
        srcSet="/backdrop/bordeaux-mobile-800.avif"
      />
      <source
        media="(max-width: 639px)"
        type="image/webp"
        srcSet="/backdrop/bordeaux-mobile-800.webp"
      />
      <source
        type="image/avif"
        srcSet="/backdrop/bordeaux-800.avif 800w, /backdrop/bordeaux-1600.avif 1600w"
        sizes={SIZES}
      />
      <source
        type="image/webp"
        srcSet="/backdrop/bordeaux-800.webp 800w, /backdrop/bordeaux-1600.webp 1600w"
        sizes={SIZES}
      />
      <img
        src="/backdrop/bordeaux-800.webp"
        alt=""
        width={1600}
        height={900}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}

export function LitFrame({
  label,
  priority = false,
  children,
}: {
  label: string;
  priority?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="ls-frame" data-ls-frame="">
      {HERO_BACKDROP === "painting" ? (
        <Painting priority={priority} />
      ) : (
        <AbstractBackdrop variant={HERO_BACKDROP} />
      )}
      <p className="ls-strip">{label}</p>
      {children}
    </div>
  );
}
