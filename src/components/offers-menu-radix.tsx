"use client";

import { ArrowRight } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link, usePathname } from "@/i18n/navigation";

import {
  OFFERS_TRIGGER_CLASS,
  type OffersMenuProps,
  PILL_LINK_CLASS,
} from "./offers-menu-types";

const OFFERS_ITEM = "offers";

export function OffersMenuRadix({
  offersLabel,
  offerGroups,
  links,
  defaultOpen,
}: OffersMenuProps & { defaultOpen: boolean }) {
  const pathname = usePathname();

  return (
    <NavigationMenu defaultValue={defaultOpen ? OFFERS_ITEM : undefined}>
      <NavigationMenuList className="gap-0.5 space-x-0">
        <NavigationMenuItem value={OFFERS_ITEM}>
          <NavigationMenuTrigger className={OFFERS_TRIGGER_CLASS}>
            {offersLabel}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] grid-cols-2 gap-1 p-2">
              {offerGroups.map((group) => (
                <div key={group.label} className="flex flex-col gap-1">
                  <p className="text-text-3 px-3 pt-2 pb-1 text-xs font-medium">
                    {group.label}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="group hover:bg-surface-2 focus-visible:bg-surface-2 flex flex-col gap-1 rounded-md p-3 transition-colors duration-(--d-fast)"
                          >
                            <span className="text-text flex items-center gap-1.5 text-sm font-medium">
                              {item.title}
                              <ArrowRight className="text-text-3 size-3.5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-(--d-fast) group-hover:translate-x-0 group-hover:opacity-100" />
                            </span>
                            <span className="text-text-2 line-clamp-2 text-[0.8125rem] leading-snug">
                              {item.description}
                            </span>
                            <span className="text-text-3 mt-1 text-xs tabular-nums">
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
              className={PILL_LINK_CLASS}
            >
              {link.label}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
