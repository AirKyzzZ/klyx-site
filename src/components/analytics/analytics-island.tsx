"use client";

import { useEffect, useRef } from "react";

import { usePathname, useSearchParams } from "next/navigation";

import { track } from "@/lib/analytics/track";

type Runtime = typeof import("./analytics-runtime");

const PRICING_PATHS = new Set(["/tarifs", "/en/pricing"]);

function whenIdle(callback: () => void) {
  let cancel = () => {};
  const schedule = () => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(callback, { timeout: 4000 });
      cancel = () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(callback, 1500);
      cancel = () => clearTimeout(id);
    }
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    cancel();
  };
}

export function AnalyticsIsland() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const runtime = useRef<Runtime | null>(null);

  useEffect(
    () =>
      whenIdle(() => {
        void import("./analytics-runtime").then((loaded) => {
          runtime.current = loaded;
          return loaded.startAnalytics();
        });
      }),
    [],
  );

  useEffect(() => {
    track("$pageview");
    if (PRICING_PATHS.has(pathname)) {
      track("pricing_view", { location: "pricing_page" });
    }
    runtime.current?.scanViews();
  }, [pathname, search]);

  return null;
}
