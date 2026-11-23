"use client";

import { useEffect, useRef } from "react";

import { ChevronDown, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import NextLink from "next/link";
import { useParams } from "next/navigation";

import { getLocaleHref } from "@/i18n/locale-href";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { internalPathname } from "@/lib/machine/markdown-href";
import { cn } from "@/lib/utils";

const LOCALE_NAMES: Record<(typeof routing.locales)[number], string> = {
  fr: "Français",
  en: "English",
};

function useLocaleLinks() {
  const current = useLocale();
  const params = useParams();
  const pathname = internalPathname(usePathname(), params);
  return routing.locales.map((locale) => ({
    locale,
    href: getLocaleHref(locale, pathname, params),
    current: locale === current,
  }));
}

export function LanguageSwitcher() {
  const links = useLocaleLinks();

  return (
    <nav
      aria-label="Language"
      className="flex gap-2 font-mono text-xs tracking-[0.06em]"
    >
      {links.map((link) => (
        <NextLink
          key={link.locale}
          href={link.href}
          hrefLang={link.locale}
          aria-current={link.current ? "true" : undefined}
          className={
            link.current
              ? "text-text"
              : "text-text-3 hover:text-text transition-colors"
          }
        >
          {link.locale.toUpperCase()}
        </NextLink>
      ))}
    </nav>
  );
}

export function LanguageMenu({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const links = useLocaleLinks();
  const ref = useRef<HTMLDetailsElement>(null);
  const current = links.find((link) => link.current) ?? links[0];

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const details = ref.current;
      if (!details?.open) return;
      if (event.target instanceof Node && details.contains(event.target)) {
        return;
      }
      details.open = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && ref.current?.open) {
        ref.current.open = false;
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <details ref={ref} className={cn("group relative", className)}>
      <summary className="text-text-2 hover:bg-surface-2 hover:text-text flex h-[34px] cursor-pointer list-none items-center gap-[5px] rounded-full pr-2 pl-2.5 text-[0.8125rem] font-medium transition-colors duration-(--d-fast) [&::-webkit-details-marker]:hidden">
        <Globe aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
        <span className="sr-only">{label} </span>
        {current.locale.toUpperCase()}
        <ChevronDown
          aria-hidden="true"
          className="size-3 transition-transform duration-(--d-fast) group-open:rotate-180"
        />
      </summary>
      <nav
        aria-label="Language"
        className="border-line bg-surface-1 shadow-soft absolute top-[calc(100%+0.5rem)] right-0 z-10 flex min-w-36 flex-col rounded-lg border p-1"
      >
        {links.map((link) => (
          <NextLink
            key={link.locale}
            href={link.href}
            hrefLang={link.locale}
            lang={link.locale}
            aria-current={link.current ? "true" : undefined}
            onClick={() => {
              if (ref.current) ref.current.open = false;
            }}
            className="text-text-2 hover:bg-surface-2 hover:text-text aria-[current=true]:text-text flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-(--d-fast)"
          >
            {LOCALE_NAMES[link.locale]}
            <span className="text-text-3 font-mono text-xs">
              {link.locale.toUpperCase()}
            </span>
          </NextLink>
        ))}
      </nav>
    </details>
  );
}
