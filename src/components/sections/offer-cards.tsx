import { ChevronRight } from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { Offer } from "@/lib/offers";

import { SectionHeader } from "./section-header";

type OfferCard = {
  href: Offer["page"];
  name: string;
  outcome: string;
  price: string;
};

type OfferCardsProps = {
  label: string;
  title: string;
  subtitle: string;
  linkLabel: string;
  items: OfferCard[];
};

export function OfferCards({
  label,
  title,
  subtitle,
  linkLabel,
  items,
}: OfferCardsProps) {
  return (
    <section className="pb-28 lg:pb-32">
      <div className="container">
        <SectionHeader label={label} title={title} subtitle={subtitle} />

        <Card className="mt-8 rounded-3xl md:mt-12 lg:mt-20">
          <CardContent className="flex p-0 max-md:flex-col">
            {items.map((item, i) => (
              <div key={item.href} className="flex flex-1 max-md:flex-col">
                <Link
                  href={item.href}
                  className="group flex flex-1 flex-col justify-between gap-10 p-6 md:p-8"
                >
                  <div className="space-y-4">
                    <p className="text-foreground font-mono text-sm">
                      {item.price}
                    </p>
                    <p className="text-muted-foreground leading-snug">
                      {item.outcome}
                    </p>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="font-display max-w-60 text-2xl leading-tight font-bold tracking-tight">
                      {item.name}
                    </h3>
                    <span className="rounded-full border p-2">
                      <ChevronRight className="size-6 transition-transform group-hover:translate-x-1" />
                      <span className="sr-only">{linkLabel}</span>
                    </span>
                  </div>
                </Link>
                {i < items.length - 1 && (
                  <>
                    <div className="relative hidden md:block">
                      <DashedLine orientation="vertical" />
                    </div>
                    <div className="relative block md:hidden">
                      <DashedLine orientation="horizontal" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
