import Image from "next/image";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { CaseStudyMeta } from "@/lib/content";
import { cn } from "@/lib/utils";

type CaseGridProps = {
  items: CaseStudyMeta[];
  readLabel: string;
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
  className?: string;
};

export function CaseGrid({
  items,
  readLabel,
  title,
  subtitle,
  viewAllLabel,
  className,
}: CaseGridProps) {
  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container">
        {title && (
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-4">
              <h2 className="text-3xl tracking-tight md:text-4xl lg:text-5xl">
                {title}
              </h2>
              {subtitle && (
                <p className="text-muted-foreground max-w-xl leading-snug">
                  {subtitle}
                </p>
              )}
            </div>
            {viewAllLabel && (
              <Button variant="outline" className="w-fit shadow-md" asChild>
                <Link href="/realisations">
                  {viewAllLabel} <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        )}

        <ul
          className={cn(
            "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
            title && "mt-8 md:mt-12 lg:mt-16",
          )}
        >
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={{
                  pathname: "/realisations/[slug]",
                  params: { slug: item.slug },
                }}
                className="group block h-full"
              >
                <Card className="bg-muted h-full overflow-hidden border-none shadow-none">
                  <CardContent className="flex h-full flex-col p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.client}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                      <div className="space-y-2">
                        <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                          {item.client} · {item.year}
                        </p>
                        <h3 className="font-display text-xl leading-tight font-semibold tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-snug">
                          {item.summary}
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        {readLabel}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
