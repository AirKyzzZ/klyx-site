import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { bindPunctuation } from "@/lib/headings";
import { cn } from "@/lib/utils";

export function PostCard({
  slug,
  title,
  summary,
  date,
  dateLabel,
  readingTime,
  tag,
  as: Heading = "h2",
  className,
}: {
  slug: string;
  title: string;
  summary: string;
  date: string;
  dateLabel: string;
  readingTime: string;
  tag?: string;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <Link
      href={{ pathname: "/blog/[slug]", params: { slug } }}
      data-post-card
      className={cn(
        "group border-line bg-surface-1 shadow-panel hover:border-line-strong flex h-full flex-col gap-4 rounded-[16px] border p-6 transition-colors duration-(--d-fast) sm:p-7",
        className,
      )}
    >
      {tag && <p className="text-accent text-[0.8125rem] font-medium">{tag}</p>}
      <Heading className="text-text text-[1.3125rem] leading-[1.2] font-semibold tracking-[-0.4px] text-balance">
        {bindPunctuation(title)}
      </Heading>
      <p className="text-text-2 text-[0.9375rem] leading-normal">{summary}</p>
      <div className="border-line mt-auto flex items-center justify-between gap-4 border-t pt-4">
        <p className="text-text-3 text-[0.8125rem]">
          <time dateTime={date}>{dateLabel}</time>
          <span aria-hidden="true"> · </span>
          {readingTime}
        </p>
        <span
          aria-hidden="true"
          className="border-line-strong text-text-2 group-hover:border-text group-hover:text-text grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-(--d-fast)"
        >
          <ArrowUpRight className="size-[15px]" />
        </span>
      </div>
    </Link>
  );
}
