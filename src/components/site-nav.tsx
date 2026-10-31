"use client";

import { useState } from "react";

import Image from "next/image";

import { ChevronRight } from "lucide-react";

import { ActionButton } from "@/components/action-button";
import { LanguageSwitcher } from "@/components/language-switcher";
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

export type SiteNavProps = {
  homeLabel: string;
  offersLabel: string;
  offers: { href: Offer["page"]; title: string; description: string }[];
  links: { href: NavHref; label: string }[];
  bookLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
};

export function SiteNav({
  homeLabel,
  offersLabel,
  offers,
  links,
  bookLabel,
  openMenuLabel,
  closeMenuLabel,
}: SiteNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsOffersOpen(false);
  };

  return (
    <div className="bg-background/70 absolute top-5 left-1/2 z-50 w-[min(92%,880px)] -translate-x-1/2 rounded-4xl border backdrop-blur-md lg:top-12">
      <div className="flex items-center justify-between gap-4 px-5 py-2.5 lg:px-6">
        <Link
          href="/"
          aria-label={homeLabel}
          className="flex shrink-0 items-center gap-2"
          onClick={closeMenu}
        >
          <Image
            src="/brand/klyx-black.png"
            alt=""
            width={801}
            height={759}
            priority
            className="h-6 w-auto"
          />
          <span className="font-display text-xl leading-none font-semibold tracking-tight">
            Klyx
          </span>
        </Link>

        <NavigationMenu className="max-lg:hidden">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="data-[state=open]:bg-accent/50 bg-transparent! px-1.5">
                {offersLabel}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-[420px] space-y-1 p-3">
                  {offers.map((item) => (
                    <li key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="group hover:bg-accent focus:bg-accent flex rounded-md p-3 leading-none outline-hidden transition-colors select-none"
                        >
                          <div className="space-y-1.5 transition-transform duration-300 group-hover:translate-x-1">
                            <div className="text-sm leading-none font-medium">
                              {item.title}
                            </div>
                            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {links.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={cn(
                    "px-1.5 text-sm font-medium transition-opacity hover:opacity-75",
                    pathname === link.href && "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          <div className="text-sm max-lg:hidden">
            <LanguageSwitcher />
          </div>
          <ActionButton action="book" size="sm" className="max-sm:hidden">
            {bookLabel}
          </ActionButton>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="site-mobile-menu"
            className="text-muted-foreground relative flex size-8 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">
              {isMenuOpen ? closeMenuLabel : openMenuLabel}
            </span>
            <div className="absolute top-1/2 left-1/2 block w-[18px] -translate-x-1/2 -translate-y-1/2">
              <span
                aria-hidden="true"
                className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? "rotate-45" : "-translate-y-1.5"}`}
              />
              <span
                aria-hidden="true"
                className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                aria-hidden="true"
                className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? "-rotate-45" : "translate-y-1.5"}`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        id="site-mobile-menu"
        className={cn(
          "bg-background fixed inset-x-0 top-[calc(100%+1rem)] flex flex-col rounded-2xl border p-6 transition-all duration-300 ease-in-out lg:hidden",
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0",
        )}
      >
        <nav className="divide-border flex flex-1 flex-col divide-y">
          <div className="py-4 first:pt-0">
            <button
              type="button"
              aria-expanded={isOffersOpen}
              onClick={() => setIsOffersOpen(!isOffersOpen)}
              className="flex w-full items-center justify-between text-base font-medium"
            >
              {offersLabel}
              <ChevronRight
                className={cn(
                  "size-4 transition-transform duration-200",
                  isOffersOpen && "rotate-90",
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isOffersOpen
                  ? "mt-4 max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0",
              )}
            >
              <div className="bg-muted/50 space-y-1 rounded-lg p-2">
                {offers.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:bg-accent block rounded-md p-2 transition-colors"
                    onClick={closeMenu}
                  >
                    <div className="font-medium">{item.title}</div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-4 text-base font-medium"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center justify-between gap-4 pt-4">
            <LanguageSwitcher />
            <ActionButton action="book" size="sm">
              {bookLabel}
            </ActionButton>
          </div>
        </nav>
      </div>
    </div>
  );
}
