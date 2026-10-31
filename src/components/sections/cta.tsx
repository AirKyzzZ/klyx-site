import { ArrowRight } from "lucide-react";

import { ActionButton } from "@/components/action-button";
import { BrowserFrame, hostOf } from "@/components/proof/browser-frame";
import { Section, SectionHeading } from "@/components/section";
import type { ProofSource } from "@/lib/proof";
import { cn } from "@/lib/utils";

import type { HeroAction } from "./hero";

type CtaProps = {
  title: string;
  emphasis?: string;
  body: string;
  primary: HeroAction;
  secondary: HeroAction;
  shot?: Extract<ProofSource, { kind: "site-shot" }> | null;
};

function Backdrop() {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet="/backdrop/bordeaux-800.avif 800w, /backdrop/bordeaux-1600.avif 1600w"
        sizes="(min-width: 1280px) 1168px, 100vw"
      />
      <source
        type="image/webp"
        srcSet="/backdrop/bordeaux-800.webp 800w, /backdrop/bordeaux-1600.webp 1600w"
        sizes="(min-width: 1280px) 1168px, 100vw"
      />
      <img
        src="/backdrop/bordeaux-800.webp"
        alt=""
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
        className="absolute inset-x-0 bottom-0 -z-2 h-[75%] w-full [mask-image:linear-gradient(180deg,transparent,#000_55%)] object-cover object-bottom opacity-70 brightness-125"
      />
    </picture>
  );
}

export function Cta({
  title,
  emphasis,
  body,
  primary,
  secondary,
  shot,
}: CtaProps) {
  return (
    <Section>
      <div className="reveal border-line-strong relative isolate overflow-hidden rounded-xl border bg-[linear-gradient(180deg,#1d1915_0%,#15130f_60%,#100f0d_100%)] shadow-[0_0_0_1px_var(--line),0_40px_160px_-40px_var(--glow)] after:absolute after:inset-0 after:-z-1 after:bg-[url(/textures/grain.png)] after:bg-size-[128px] after:mix-blend-overlay">
        <Backdrop />
        <div
          className={cn(
            "relative px-6 py-16 text-center md:px-12 md:py-20",
            shot &&
              "lg:min-h-[440px] lg:py-24 lg:pr-[48%] lg:pl-16 lg:text-left",
          )}
        >
          <SectionHeading
            lead={title}
            rest={emphasis}
            className={cn("mx-auto", shot && "lg:mx-0")}
          />
          <p
            className={cn(
              "text-text-2 mx-auto mt-5 max-w-[48ch]",
              shot && "lg:mx-0",
            )}
          >
            {body}
          </p>
          <div
            className={cn(
              "mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:items-center",
              shot && "lg:justify-start",
            )}
          >
            <ActionButton action={primary.action} size="lg">
              {primary.label}
            </ActionButton>
            <ActionButton
              action={secondary.action}
              variant="secondary"
              size="lg"
              className="bg-bg/40"
            >
              {secondary.label}
              <ArrowRight />
            </ActionButton>
          </div>
        </div>
        {shot && (
          <div
            aria-hidden="true"
            className="absolute top-[16%] right-[-8%] hidden w-[50%] rotate-[-6deg] lg:block"
          >
            <BrowserFrame
              url={shot.url}
              image={shot.image}
              alt={hostOf(shot.url)}
              sizes="600px"
            />
          </div>
        )}
      </div>
    </Section>
  );
}
