"use client";

import { useState, useSyncExternalStore } from "react";

import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEFAULT_THEME, readTheme, subscribeTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const BUTTON_CLASS = "h-[46px] w-full rounded-[10px] shadow-none";

export function CalBooking({
  calUrl,
  label,
  title,
  trackLocation,
  className,
}: {
  calUrl: string | undefined;
  label: string;
  title: string;
  trackLocation?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const theme = useSyncExternalStore(
    subscribeTheme,
    readTheme,
    () => DEFAULT_THEME,
  );
  const tracking = {
    "data-track": "cta_book_call_click",
    "data-track-location": trackLocation,
  };

  if (!calUrl) {
    return (
      <Button
        size="xl"
        className={cn(BUTTON_CLASS, className)}
        asChild
        {...tracking}
      >
        <a href="#contact-form">{label}</a>
      </Button>
    );
  }

  if (open) {
    const src = new URL(calUrl);
    src.searchParams.set("embed", "true");
    src.searchParams.set("theme", theme);
    return (
      <iframe
        src={src.toString()}
        title={title}
        className={cn(
          "border-line bg-surface-1 h-[640px] w-full rounded-[12px] border",
          className,
        )}
      />
    );
  }

  return (
    <Button
      type="button"
      size="xl"
      className={cn(BUTTON_CLASS, className)}
      onClick={() => setOpen(true)}
      {...tracking}
    >
      <CalendarDays aria-hidden="true" />
      {label}
    </Button>
  );
}
