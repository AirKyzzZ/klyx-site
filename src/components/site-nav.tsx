"use client";

import { useState } from "react";

import Image from "next/image";

import { ArrowRight } from "lucide-react";

import { ActionButton } from "@/components/action-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PageViewToggle } from "@/components/machine-view/view-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link, usePathname } from "@/i18n/navigation";
import type { Offer } from "@/lib/offers";
import { cn } from "@/lib/utils";

type NavHref = "/realisations" | "/tarifs" | "/a-propos";

type OfferLink = {
  href: Offer["page"];
  title: string;
  description: string;
  price: string;
};

export type SiteNavProps = {
  homeLabel: string;
  offersLabel: string;
  offerGroups: { label: string; items: OfferLink[] }[];
  links: { href: NavHref; label: string }[];
  bookLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
};

const pillLink =
  "inline-flex h-8 items-center rounded-full px-3 text-sm text-text-2 transition-colors duration-(--d-fast) hover:bg-surface-3 hover:text-text aria-[current=page]:text-text";

export function SiteNav({
  homeLabel,
  offersLabel,
  offerGroups,
  links,
  bookLabel,
  openMenuLabel,
  closeMenuLabel,
}: SiteNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="fixed inset-x-0 top-3 z-50 px-3 lg:top-4">
      <div className="border-line-strong bg-surface-1 shadow-card md:bg-surface-1/75 relative mx-auto flex h-14 max-w-[1080px] items-center justify-between gap-4 rounded-full border pr-2 pl-5 md:backdrop-blur-[12px]">
        <Link
          href="/"
          aria-label={homeLabel}
          className="flex shrink-0 items-center gap-2 rounded-sm"
          onClick={closeMenu}
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
            Klyx
          </span>
        </Link>

        <NavigationMenu className="max-lg:hidden">
          <NavigationMenuList className="space-x-0">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-text-2 hover:text-text data-[state=open]:text-text h-8 rounded-full bg-transparent px-3 font-normal">
                {offersLabel}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 gap-1 p-2">
                  {offerGroups.map((group) => (
                    <div key={group.label} className="flex flex-col gap-1">
                      <p className="type-label text-text-3 px-3 pt-2 pb-1">
                        {group.label}
                      </p>
                      <ul className="flex flex-col gap-1">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className="group hover:bg-surface-3 focus-visible:bg-surface-3 flex flex-col gap-1 rounded-md p-3 transition-colors duration-(--d-fast)"
                              >
                                <span className="text-text flex items-center gap-1.5 text-sm font-medium">
                                  {item.title}
                                  <ArrowRight className="text-text-3 size-3.5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-(--d-fast) group-hover:translate-x-0 group-hover:opacity-100" />
                                </span>
                                <span className="text-text-2 line-clamp-2 text-[0.8125rem] leading-snug">
                                  {item.description}
                                </span>
                                <span className="text-text-3 mt-1 font-mono text-xs tabular-nums">
                                  {item.price}
                                </span>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {links.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={pillLink}
                >
                  {link.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <div className="px-2 max-lg:hidden">
            <LanguageSwitcher />
          </div>
          <ActionButton
            trackLocation="header"
            action="book"
            className="rounded-full max-sm:hidden"
          >
            {bookLabel}
            <ArrowRight />
          </ActionButton>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="site-mobile-menu"
            className="text-text-2 hover:bg-surface-3 hover:text-text relative flex size-10 rounded-full lg:hidden"
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
            "border-line-strong bg-surface-1 shadow-window absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-xl border p-2 transition-[opacity,transform] duration-(--d-ui) ease-out lg:hidden",
            isMenuOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0",
          )}
        >
          <nav className="flex flex-col">
            {offerGroups.map((group) => (
              <div key={group.label} className="flex flex-col pb-2">
                <p className="type-label text-text-3 px-3 pt-3 pb-1">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:bg-surface-3 flex items-baseline justify-between gap-4 rounded-md px-3 py-2.5"
                    onClick={closeMenu}
                  >
                    <span className="text-text font-medium">{item.title}</span>
                    <span className="text-text-3 font-mono text-xs whitespace-nowrap tabular-nums">
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
                  className="text-text-2 hover:bg-surface-3 hover:text-text aria-[current=page]:text-text rounded-md px-3 py-2.5"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="border-line flex border-t px-3 py-3">
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
                size="lg"
                className="rounded-full"
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
