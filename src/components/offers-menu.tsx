"use client";

import { lazy, Suspense, useState, useSyncExternalStore } from "react";

import { ChevronDown } from "lucide-react";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu-styles";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import {
  OFFERS_TRIGGER_CLASS,
  type OffersMenuProps,
  PILL_LINK_CLASS,
} from "./offers-menu-types";

const OffersMenuRadix = lazy(() =>
  import("./offers-menu-radix").then((module) => ({
    default: module.OffersMenuRadix,
  })),
);

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

function OffersMenuStatic({
  offersLabel,
  links,
  onTriggerClick,
}: OffersMenuProps & { onTriggerClick: () => void }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="relative z-10 flex max-w-max flex-1 items-center justify-center"
    >
      <div className="relative">
        <ul className="group flex flex-1 list-none items-center justify-center gap-0.5 space-x-0">
          <li>
            <button
              type="button"
              aria-expanded="false"
              data-state="closed"
              onClick={onTriggerClick}
              className={cn(
                navigationMenuTriggerStyle(),
                "group",
                OFFERS_TRIGGER_CLASS,
              )}
            >
              {offersLabel}{" "}
              <ChevronDown
                className="relative top-px ml-1 size-3 transition duration-300"
                aria-hidden="true"
              />
            </button>
          </li>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={PILL_LINK_CLASS}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function OffersMenu(props: OffersMenuProps) {
  const isDesktop = useIsDesktop();
  const [openRequested, setOpenRequested] = useState(false);
  const fallback = (
    <OffersMenuStatic
      {...props}
      onTriggerClick={() => setOpenRequested(true)}
    />
  );
  if (!isDesktop) return fallback;

  return (
    <Suspense fallback={fallback}>
      <OffersMenuRadix {...props} defaultOpen={openRequested} />
    </Suspense>
  );
}
