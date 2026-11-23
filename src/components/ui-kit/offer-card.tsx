import type { ComponentProps, ReactNode } from "react";

import { Clock } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { Offer } from "@/lib/offers";
import { cn } from "@/lib/utils";

export type OfferCardProps = {
  name: string;
  audience: string;
  body: string;
  priceLabel?: string;
  price: string;
  unit?: string;
  duration: string;
  href: Offer["page"];
  linkLabel: string;
  illustration?: ReactNode;
  extra?: ReactNode;
  as?: "h2" | "h3" | "h4";
  className?: string;
};

export function OfferCard({
  name,
  audience,
  body,
  priceLabel,
  price,
  unit,
  duration,
  href,
  linkLabel,
  illustration,
  extra,
  as: Heading = "h3",
  className,
}: OfferCardProps) {
  return (
    <article
      data-offer-card
      className={cn("flex flex-col gap-5 p-6 lg:p-8", className)}
    >
      {illustration && (
        <div
          aria-hidden="true"
          className="bg-surface-2 relative h-[150px] overflow-hidden rounded-[12px]"
        >
          {illustration}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2">
        <Heading className="text-text text-[1.375rem] leading-[1.1] font-semibold tracking-[-0.5px]">
          {name}
        </Heading>
        <p className="text-text mt-1 text-base leading-[1.4] font-medium">
          {audience}
        </p>
        <p className="text-text-2 text-[0.9375rem] leading-normal">{body}</p>
        {extra && <div className="mt-auto pt-4">{extra}</div>}
      </div>
      <div className="mt-5 flex flex-col gap-1">
        {priceLabel && (
          <p className="text-text-3 text-[0.8125rem]">{priceLabel}</p>
        )}
        <p className="text-text flex items-baseline gap-0.5 text-[1.875rem] leading-none font-semibold tracking-[-1px]">
          {price}
          {unit && (
            <span className="text-text-2 ml-1 text-[0.9375rem] font-normal tracking-normal">
              {unit}
            </span>
          )}
        </p>
        <p className="text-text-2 flex items-center gap-1.5 pt-1.5 text-sm">
          <Clock aria-hidden="true" className="size-3.5" />
          {duration}
        </p>
      </div>
      <Link
        href={href}
        className="text-accent-text w-fit text-sm font-medium underline decoration-1 underline-offset-[3px] hover:decoration-2"
      >
        {linkLabel}
      </Link>
    </article>
  );
}

export function OfferRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-line bg-surface-1 divide-line grid overflow-hidden rounded-[16px] border max-lg:divide-y lg:grid-cols-3 lg:divide-x",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CatalogueLinks({
  label,
  items,
  className,
}: {
  label: string;
  items: { label: string; href: ComponentProps<typeof Link>["href"] }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.9375rem]",
        className,
      )}
    >
      <p className="text-text-3">{label}</p>
      <ul className="contents">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-text hover:text-accent-text font-medium underline decoration-1 underline-offset-[3px] transition-colors duration-(--d-fast)"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
