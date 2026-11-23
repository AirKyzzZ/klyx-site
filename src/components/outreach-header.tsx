import Link from "next/link";

import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { KlyxMark } from "@/components/brand/klyx-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { OUTREACH_CTA } from "@/lib/outreach-pages";
import { site } from "@/lib/site";

export async function OutreachHeader() {
  const t = await getTranslations({ locale: "fr", namespace: "nav.theme" });

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:px-(--page-x) lg:top-4">
      <div className="border-line bg-nav-fill shadow-nav mx-auto flex h-14 max-w-(--container) items-center justify-between gap-4 rounded-[14px] border pr-2 pl-4 backdrop-blur-[16px] lg:pl-[18px]">
        <Link
          href="/"
          aria-label={site.name}
          className="flex shrink-0 items-center gap-[9px] rounded-sm"
        >
          <KlyxMark className="size-6" />
          <span className="text-lg leading-none font-semibold tracking-[-0.4px]">
            {site.name}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle
            labels={{ label: t("label"), light: t("light"), dark: t("dark") }}
          />
          <ActionButton
            action="book"
            variant="inverse"
            className="h-10 rounded-[10px] px-4"
          >
            {OUTREACH_CTA}
          </ActionButton>
        </div>
      </div>
    </header>
  );
}
