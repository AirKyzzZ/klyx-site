"use client";

import { useState } from "react";

import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CalBooking({
  calUrl,
  label,
  title,
}: {
  calUrl: string | undefined;
  label: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  if (!calUrl) {
    return (
      <Button size="lg" className="w-full" asChild>
        <a href="#contact-form">{label}</a>
      </Button>
    );
  }

  if (open) {
    const src = new URL(calUrl);
    src.searchParams.set("embed", "true");
    src.searchParams.set("theme", "dark");
    return (
      <iframe
        src={src.toString()}
        title={title}
        className="border-line-strong bg-bg-sunken h-[640px] w-full rounded-sm border"
      />
    );
  }

  return (
    <Button
      type="button"
      size="lg"
      className="w-full"
      onClick={() => setOpen(true)}
    >
      <CalendarDays aria-hidden="true" />
      {label}
    </Button>
  );
}
