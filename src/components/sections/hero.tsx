import type { ReactNode } from "react";

import { ArrowRight } from "lucide-react";

import { ActionButton } from "@/components/action-button";
import { DashedLine } from "@/components/dashed-line";
import { EmphasisTitle } from "@/components/emphasis-title";

export type HeroAction = { action: "book" | "quote"; label: string };

type HeroProps = {
  eyebrow?: string;
  title: string;
  emphasis?: string;
  subtitle: string;
  primary?: HeroAction;
  secondary?: HeroAction;
  aside?: ReactNode;
};

export function Hero({
  eyebrow,
  title,
  emphasis,
  subtitle,
  primary,
  secondary,
  aside,
}: HeroProps) {
  return (
    <section className="pt-36 pb-20 lg:pt-48 lg:pb-28">
      <div className="container flex flex-col justify-between gap-10 md:gap-14 lg:flex-row lg:gap-20">
        <div className="flex-[1.5]">
          {eyebrow && (
            <p className="text-muted-foreground mb-5 font-mono text-xs tracking-wider uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="text-foreground max-w-3xl text-4xl leading-[1.05] tracking-tight text-balance md:text-5xl lg:text-6xl">
            <EmphasisTitle title={title} emphasis={emphasis} />
          </h1>

          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-snug text-balance md:text-xl lg:text-2xl">
            {subtitle}
          </p>

          {(primary || secondary) && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {primary && (
                <ActionButton action={primary.action} size="lg">
                  {primary.label}
                </ActionButton>
              )}
              {secondary && (
                <ActionButton
                  action={secondary.action}
                  variant="secondary"
                  size="lg"
                >
                  {secondary.label}
                  <ArrowRight className="stroke-3" />
                </ActionButton>
              )}
            </div>
          )}
        </div>

        {aside && (
          <div className="relative flex flex-1 flex-col justify-center max-lg:pt-10 lg:pl-10">
            <DashedLine
              orientation="vertical"
              className="absolute top-0 left-0 max-lg:hidden"
            />
            <DashedLine
              orientation="horizontal"
              className="absolute top-0 lg:hidden"
            />
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}

type HeroListItem = {
  title: string;
  body?: string;
  meta?: string;
};

export function HeroList({ items }: { items: HeroListItem[] }) {
  return (
    <ul className="space-y-6">
      {items.map((item) => (
        <li key={item.title} className="flex gap-3 lg:gap-5">
          <span
            aria-hidden="true"
            className="bg-foreground mt-2 size-1.5 shrink-0 rounded-full"
          />
          <div>
            <p className="font-text text-foreground font-semibold">
              {item.title}
            </p>
            {item.meta && (
              <p className="text-foreground mt-0.5 font-mono text-sm">
                {item.meta}
              </p>
            )}
            {item.body && (
              <p className="text-muted-foreground mt-0.5 max-w-80 text-sm">
                {item.body}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
