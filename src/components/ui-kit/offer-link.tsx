import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function OfferLink({
  href,
  name,
  price,
  className,
}: {
  href: string;
  name: string;
  price: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group border-line bg-surface-1 shadow-panel hover:border-line-strong flex h-full items-center justify-between gap-4 rounded-[12px] border px-5 py-4 text-left transition-colors duration-(--d-fast)",
        className,
      )}
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-text group-hover:text-accent-text font-semibold transition-colors duration-(--d-fast)">
          {name}
        </span>
        <span className="text-text-2 text-sm">{price}</span>
      </span>
      <span
        aria-hidden="true"
        className="border-line-strong text-text-2 group-hover:border-text group-hover:text-text grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-(--d-fast)"
      >
        <ArrowUpRight className="size-[15px]" />
      </span>
    </Link>
  );
}
