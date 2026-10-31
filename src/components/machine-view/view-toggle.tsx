"use client";

import type { KeyboardEvent, MouseEvent } from "react";
import { useSyncExternalStore } from "react";

import { hasLocale, useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { getLocaleHref } from "@/i18n/locale-href";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { internalPathname, markdownHref } from "@/lib/machine/markdown-href";
import { cn } from "@/lib/utils";

const MACHINE_HASH = "#machine";
const MODE_EVENT = "klyx:machine-mode";

export const wipeOrigin = { x: "50%", y: "100%" };

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener(MODE_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(MODE_EVENT, onChange);
  };
}

export function useMachineMode(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash === MACHINE_HASH,
    () => false,
  );
}

export function setMachineMode(on: boolean) {
  const url = new URL(window.location.href);
  url.hash = on ? MACHINE_HASH : "";
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(MODE_EVENT));
}

const noopSubscribe = () => () => {};

export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useMarkdownHref(): string {
  const current = useLocale();
  const locale = hasLocale(routing.locales, current)
    ? current
    : routing.defaultLocale;
  const pathname = usePathname();
  const params = useParams();
  const href = getLocaleHref(
    locale,
    internalPathname(pathname, params),
    params,
  );
  return markdownHref(locale, href);
}

type ViewToggleProps = {
  markdownHref: string;
  variant: "floating" | "inline";
};

export function ViewToggle({ markdownHref, variant }: ViewToggleProps) {
  const t = useTranslations("machine");
  const machine = useMachineMode();
  const hydrated = useHydrated();

  const toggle = (
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
  ) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    wipeOrigin.x = `${rect.left + rect.width / 2}px`;
    wipeOrigin.y = `${rect.top + rect.height / 2}px`;
    setMachineMode(!machine);
  };

  return (
    <a
      href={markdownHref}
      role={hydrated ? "switch" : undefined}
      aria-checked={hydrated ? machine : undefined}
      aria-label={t("machine")}
      data-state={machine ? "machine" : "human"}
      className={cn("view-toggle", `view-toggle--${variant}`)}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === " ") toggle(event);
      }}
    >
      <span className="view-toggle-option" data-option="human">
        {t("human")}
      </span>
      <span className="view-toggle-option" data-option="machine">
        {t("machine")}
      </span>
    </a>
  );
}

export function PageViewToggle({ variant }: Pick<ViewToggleProps, "variant">) {
  return <ViewToggle markdownHref={useMarkdownHref()} variant={variant} />;
}
