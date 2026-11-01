export const HERO_BACKDROPS = ["grid", "mesh", "flow", "painting"] as const;

export type HeroBackdrop = (typeof HERO_BACKDROPS)[number];
export type AbstractBackdropVariant = Exclude<HeroBackdrop, "painting">;

export const DEFAULT_HERO_BACKDROP: HeroBackdrop = "grid";

export function parseHeroBackdrop(value: string | undefined): HeroBackdrop {
  if (!value) return DEFAULT_HERO_BACKDROP;
  const match = HERO_BACKDROPS.find((variant) => variant === value);
  if (!match) {
    throw new Error(
      `NEXT_PUBLIC_HERO_BACKDROP="${value}" is not one of ${HERO_BACKDROPS.join(", ")}`,
    );
  }
  return match;
}

export const HERO_BACKDROP = parseHeroBackdrop(
  process.env.NEXT_PUBLIC_HERO_BACKDROP,
);
