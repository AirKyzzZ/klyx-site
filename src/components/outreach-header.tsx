import Image from "next/image";
import Link from "next/link";

import { ActionButton } from "@/components/action-button";
import { OUTREACH_CTA } from "@/lib/outreach-pages";
import { site } from "@/lib/site";

export function OutreachHeader() {
  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 lg:top-4">
      <div className="border-line-strong bg-surface-1 shadow-card md:bg-surface-1/75 mx-auto flex h-14 max-w-[1080px] items-center justify-between gap-4 rounded-full border pr-2 pl-5 md:backdrop-blur-[12px]">
        <Link
          href="/"
          aria-label={site.name}
          className="flex shrink-0 items-center gap-2 rounded-sm"
        >
          <Image
            src="/brand/klyx-white.png"
            alt=""
            width={801}
            height={759}
            priority
            className="h-5 w-auto"
          />
          <span className="text-[1.0625rem] leading-none font-semibold tracking-[-0.03em]">
            {site.name}
          </span>
        </Link>
        <ActionButton action="book" className="rounded-full">
          {OUTREACH_CTA}
        </ActionButton>
      </div>
    </header>
  );
}
