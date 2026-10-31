import { Check } from "lucide-react";

import { ActionButton } from "@/components/action-button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { SectionHeader } from "./section-header";

type Tier = {
  name: string;
  price?: string;
  duration?: string;
  summary?: string;
  features: string[];
  highlighted?: boolean;
};

type TierCardsProps = {
  title: string;
  subtitle?: string;
  tiers: Tier[];
  quoteLabel: string;
  footnote?: string;
};

export function TierCards({
  title,
  subtitle,
  tiers,
  quoteLabel,
  footnote,
}: TierCardsProps) {
  return (
    <section className="py-28 lg:py-32">
      <div className="container">
        <SectionHeader title={title} subtitle={subtitle} />

        <div
          className={cn(
            "mx-auto mt-8 grid items-start gap-5 text-start md:mt-12 lg:mt-20",
            tiers.length === 2
              ? "max-w-4xl md:grid-cols-2"
              : "max-w-5xl md:grid-cols-3",
          )}
        >
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "h-full",
                tier.highlighted && "outline-primary origin-top outline-4",
              )}
            >
              <CardContent className="flex h-full flex-col gap-7 px-6 py-6">
                <div className="space-y-2">
                  <h3 className="text-foreground font-semibold">{tier.name}</h3>
                  {tier.price && (
                    <p className="text-foreground font-mono text-lg">
                      {tier.price}
                    </p>
                  )}
                  {tier.duration && (
                    <p className="text-muted-foreground font-mono text-xs">
                      {tier.duration}
                    </p>
                  )}
                  {tier.summary && (
                    <p className="text-muted-foreground pt-1 text-sm leading-snug">
                      {tier.summary}
                    </p>
                  )}
                </div>

                <ul className="flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <Check className="text-foreground mt-0.5 size-4 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <ActionButton
                  action="quote"
                  className="w-fit"
                  variant={tier.highlighted ? "primary" : "secondary"}
                >
                  {quoteLabel}
                </ActionButton>
              </CardContent>
            </Card>
          ))}
        </div>

        {footnote && (
          <p className="text-muted-foreground mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
