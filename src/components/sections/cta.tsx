import { ArrowRight } from "lucide-react";

import { ActionButton } from "@/components/action-button";

import type { HeroAction } from "./hero";

type CtaProps = {
  title: string;
  body: string;
  primary: HeroAction;
  secondary: HeroAction;
};

export function Cta({ title, body, primary, secondary }: CtaProps) {
  return (
    <section className="pt-12 pb-28 lg:pb-32">
      <div className="container space-y-4 text-center">
        <h2 className="mx-auto max-w-3xl text-3xl tracking-tight text-balance md:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">
          {body}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <ActionButton action={primary.action} size="lg">
            {primary.label}
          </ActionButton>
          <ActionButton
            action={secondary.action}
            variant="outline"
            size="lg"
            className="shadow-md"
          >
            {secondary.label}
            <ArrowRight className="stroke-3" />
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
