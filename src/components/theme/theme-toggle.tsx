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
        "border-line bg-surface-2 relative inline-flex shrink-0 items-center gap-0.5 rounded-full border p-[3px]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="bg-surface-1 absolute top-[3px] left-[3px] size-7 rounded-full shadow-[0_1px_2px_rgb(0_0_0/0.1)] transition-transform duration-(--d-ui) ease-out dark:translate-x-[30px]"
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
            "relative z-1 grid size-7 place-items-center rounded-full transition-colors duration-(--d-fast)",
            value === "light"
              ? "text-text dark:text-text-3 dark:hover:text-text"
              : "text-text-3 hover:text-text dark:text-text",
          )}
        >
          <Icon aria-hidden="true" className="size-[15px]" strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
}
