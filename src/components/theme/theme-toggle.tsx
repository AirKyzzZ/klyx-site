"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

import { Moon, Sun } from "lucide-react";

import {
  applyTheme,
  DEFAULT_THEME,
  readStoredTheme,
  readTheme,
  saveTheme,
  subscribeTheme,
  type Theme,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

export type ThemeToggleLabels = {
  label: string;
  light: string;
  dark: string;
};

const OPTIONS = [
  { theme: "light", Icon: Sun },
  { theme: "dark", Icon: Moon },
] as const;

export function ThemeToggle({
  labels,
  className,
}: {
  labels: ThemeToggleLabels;
  className?: string;
}) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    readTheme,
    () => DEFAULT_THEME,
  );

  useLayoutEffect(() => {
    // React's dev remount resets <html> attributes the inline script set.
    applyTheme(readStoredTheme());
  }, []);

  const select = (next: Theme) => {
    if (next !== readTheme()) saveTheme(next);
  };

  return (
    <div
      role="group"
      aria-label={labels.label}
      data-theme-toggle
      className={cn(
        "border-line bg-surface-2 relative inline-flex h-8 shrink-0 items-center rounded-full border p-0.5",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="bg-surface-1 shadow-soft dark:bg-surface-3 absolute top-0.5 left-0.5 size-6.5 rounded-full transition-transform duration-(--d-ui) ease-out dark:translate-x-full"
      />
      {OPTIONS.map(({ theme: value, Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          aria-label={labels[value]}
          title={labels[value]}
          data-theme-option={value}
          onClick={() => select(value)}
          className={cn(
            "relative z-1 grid size-6.5 place-items-center rounded-full transition-colors duration-(--d-fast)",
            value === "light"
              ? "text-text dark:text-text-3 dark:hover:text-text"
              : "text-text-3 hover:text-text dark:text-text",
          )}
        >
          <Icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
