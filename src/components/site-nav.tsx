"use client";

import { useState } from "react";

import { ArrowRight } from "lucide-react";

import { ActionButton } from "@/components/action-button";
import { KlyxMark } from "@/components/brand/klyx-mark";
import { LanguageMenu, LanguageSwitcher } from "@/components/language-switcher";
import { PageViewToggle } from "@/components/machine-view/view-toggle";
import { OffersMenu } from "@/components/offers-menu";
import type { NavHref, OfferLink } from "@/components/offers-menu-types";
import {
  ThemeToggle,
  type ThemeToggleLabels,
} from "@/components/theme/theme-toggle";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type SiteNavProps = {
  homeLabel: string;
  offersLabel: string;
  offerGroups: { label: string; items: OfferLink[] }[];
  links: { href: NavHref; label: string }[];
  bookLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
  languageLabel: string;
  themeLabels: ThemeToggleLabels;
};

export function SiteNav({
  homeLabel,
  offersLabel,
  offerGroups,
  links,
  bookLabel,
  openMenuLabel,
  closeMenuLabel,
  languageLabel,
  themeLabels,
}: SiteNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="fixed inset-x-0 top-3 z-50 px-3 md:px-(--page-x) lg:top-4">
      <div
        data-site-nav
        className="border-line bg-nav-fill shadow-nav relative mx-auto flex h-14 max-w-(--container) items-center justify-between gap-4 rounded-[14px] border pr-2 pl-4 backdrop-blur-[16px] lg:pl-[18px]"
      >
        <Link
          href="/"
          aria-label={homeLabel}
          className="flex shrink-0 items-center gap-[9px] rounded-sm xl:w-[330px]"
          onClick={closeMenu}
        >
          <KlyxMark className="size-6" />
          <span className="text-lg leading-none font-semibold tracking-[-0.4px]">
            Klyx
          </span>
        </Link>

        <div className="max-lg:hidden">
          <OffersMenu
            offersLabel={offersLabel}
            offerGroups={offerGroups}
            links={links}
          />
        </div>

        <div className="flex items-center justify-end gap-2 xl:w-[330px]">
          <ThemeToggle labels={themeLabels} className="max-lg:hidden" />
          <LanguageMenu label={languageLabel} className="max-lg:hidden" />
          <ActionButton
            trackLocation="header"
            action="book"
            variant="inverse"
            className="h-10 rounded-[10px] px-4 max-sm:hidden"
          >
            {bookLabel}
          </ActionButton>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="site-mobile-menu"
            className="text-text-2 hover:bg-surface-2 hover:text-text relative flex size-10 rounded-full lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">
              {isMenuOpen ? closeMenuLabel : openMenuLabel}
            </span>
            <span className="absolute top-1/2 left-1/2 block w-4 -translate-x-1/2 -translate-y-1/2">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute block h-px w-full bg-current transition-transform duration-(--d-ui) ease-out",
                  isMenuOpen ? "rotate-45" : "-translate-y-[3px]",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute block h-px w-full bg-current transition-transform duration-(--d-ui) ease-out",
                  isMenuOpen ? "-rotate-45" : "translate-y-[3px]",
                )}
              />
            </span>
          </button>
        </div>

        <div
          id="site-mobile-menu"
          className={cn(
            "border-line bg-surface-1 shadow-window absolute inset-x-0 top-[calc(100%+0.5rem)] max-h-[calc(100svh-6rem)] overflow-y-auto rounded-[14px] border p-2 transition-[opacity,transform] duration-(--d-ui) ease-out lg:hidden",
            isMenuOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0",
          )}
        >
          <nav className="flex flex-col">
            {offerGroups.map((group) => (
              <div key={group.label} className="flex flex-col pb-2">
                <p className="text-text-3 px-3 pt-3 pb-1 text-xs font-medium">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:bg-surface-2 flex items-baseline justify-between gap-4 rounded-md px-3 py-2.5"
                    onClick={closeMenu}
                  >
                    <span className="text-text font-medium">{item.title}</span>
                    <span className="text-text-3 text-xs whitespace-nowrap tabular-nums">
                      {item.price}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
            <div className="border-line flex flex-col border-t py-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="text-text-2 hover:bg-surface-2 hover:text-text aria-[current=page]:text-text rounded-md px-3 py-2.5"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="border-line flex items-center justify-between gap-4 border-t px-3 py-3">
              <ThemeToggle labels={themeLabels} />
              <PageViewToggle
                variant="inline"
                onToggle={(machine) => {
                  if (machine) closeMenu();
                }}
              />
            </div>
            <div className="border-line flex items-center justify-between gap-4 border-t px-3 pt-3 pb-1">
              <LanguageSwitcher />
              <ActionButton
                trackLocation="header"
                action="book"
                variant="inverse"
                size="lg"
                className="rounded-[10px]"
              >
                {bookLabel}
                <ArrowRight />
              </ActionButton>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
