import Image from "next/image";

import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function CaseRow({
  slug,
  name,
  kind,
  summary,
  meta,
  image,
  className,
}: {
  slug: string;
  name: string;
  kind: string;
  summary: string;
  meta: string;
  image: string;
  className?: string;
}) {
  return (
    <Link
      href={{ pathname: "/realisations/[slug]", params: { slug } }}
      data-case-row
      className={cn(
        "group border-line grid grid-cols-[6rem_1fr_auto] items-center gap-4 border-b py-5 sm:grid-cols-[9rem_1fr_auto] sm:gap-7 lg:grid-cols-[9rem_minmax(0,300px)_minmax(0,420px)_1fr_auto]",
        className,
      )}
    >
      <div className="border-line bg-surface-2 aspect-[16/10] overflow-hidden rounded-[8px] border">
        <Image
          src={image}
          alt=""
          width={288}
          height={180}
          sizes="144px"
          className="size-full object-cover object-top"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="text-text group-hover:text-accent text-[1.1875rem] leading-tight font-semibold tracking-[-0.4px] transition-colors duration-(--d-fast)">
          {name}
        </h3>
        <p className="text-text-3 text-sm">{kind}</p>
        <p className="text-text-2 mt-1 text-sm leading-snug lg:hidden">
          {summary}
        </p>
      </div>
      <p className="text-text-2 text-[0.9375rem] leading-normal max-lg:hidden">
        {summary}
      </p>
      <p className="text-text-3 justify-self-end text-right text-[0.8125rem] leading-normal max-lg:hidden lg:max-w-[156px]">
        {meta}
      </p>
      <span
        aria-hidden="true"
        className="border-line-strong text-text-2 group-hover:border-text group-hover:text-text grid size-9 place-items-center rounded-full border transition-colors duration-(--d-fast)"
      >
        <ArrowUpRight className="size-[15px]" />
      </span>
    </Link>
  );
}
