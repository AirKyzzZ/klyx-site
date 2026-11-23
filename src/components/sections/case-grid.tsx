import Image from "next/image";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { CaseStatus, CaseStudyMeta } from "@/lib/content";
import { getSiteShot } from "@/lib/proof";
import { cn } from "@/lib/utils";

export function CaseStatusBadge({
  status,
  className,
}: {
  status: CaseStatus;
  className?: string;
}) {
  const t = useTranslations("cases.status");
  return (
    <span
      className={cn(
        "border-line bg-surface-2 text-text-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        className,
      )}
    >
      <span aria-hidden="true" className="bg-accent size-1.5 rounded-full" />
      {t(status)}
    </span>
  );
}

export function CaseCard({
  item,
  readLabel,
  sizes = "(min-width: 768px) 500px, 90vw",
  as: Heading = "h3",
  className,
}: {
  item: CaseStudyMeta;
  readLabel: string;
  sizes?: string;
  as?: "h2" | "h3";
  className?: string;
}) {
  const image = getSiteShot(item.slug)?.image ?? item.image;
  return (
    <Link
      href={{ pathname: "/realisations/[slug]", params: { slug: item.slug } }}
      data-case-card
      className={cn(
        "group border-line bg-surface-1 hover:border-line-strong flex h-full flex-col overflow-hidden rounded-[20px] border transition-colors duration-(--d-fast)",
        className,
      )}
    >
      <div className="bg-surface-2 border-line relative aspect-[16/10] overflow-hidden border-b">
        <div className="border-line shadow-panel absolute inset-x-[8%] top-[10%] aspect-[16/10] overflow-hidden rounded-[10px] border transition-transform duration-(--d-ui) ease-(--ease-out) group-hover:-translate-y-1">
          <Image
            src={image}
            alt={item.name}
            fill
            sizes={sizes}
            className="object-cover object-top"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="text-text-3 text-sm">{item.kind}</p>
          {item.status && <CaseStatusBadge status={item.status} />}
        </div>
        <Heading className="text-text group-hover:text-accent text-[1.3125rem] leading-tight font-semibold tracking-[-0.4px] transition-colors duration-(--d-fast)">
          {item.name}
        </Heading>
        <p className="text-text-2 text-[0.9375rem] leading-normal">
          {item.summary}
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <span className="text-text-3 text-[0.8125rem] leading-normal">
            {[...item.stack, item.year].join(", ")}
          </span>
          <span className="text-text flex shrink-0 items-center gap-2 text-sm font-medium">
            <span className="max-sm:sr-only">{readLabel}</span>
            <span
              aria-hidden="true"
              className="border-line-strong text-text-2 group-hover:border-text group-hover:text-text grid size-9 place-items-center rounded-full border transition-colors duration-(--d-fast)"
            >
              <ArrowUpRight className="size-[15px]" />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CaseList({
  items,
  readLabel,
  className,
}: {
  items: CaseStudyMeta[];
  readLabel: string;
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-5 md:grid-cols-2 lg:gap-6", className)}>
      {items.map((item) => (
        <li key={item.slug}>
          <CaseCard item={item} readLabel={readLabel} as="h2" />
        </li>
      ))}
    </ul>
  );
}
