import { connectAnalytics, track } from "@/lib/analytics/track";

const DEFAULT_HOST = "https://eu.i.posthog.com";

let started = false;
let observer: IntersectionObserver | undefined;

export function trackLocation(element: HTMLElement, pathname: string) {
  return (
    element.dataset.trackLocation ??
    (pathname.startsWith("/pour/") ? "pour_page" : "page")
  );
}

function onClick(event: MouseEvent) {
  if (!(event.target instanceof Element)) return;
  const element = event.target.closest<HTMLElement>("[data-track]");
  if (!element?.dataset.track) return;
  track(element.dataset.track, {
    location: trackLocation(element, window.location.pathname),
  });
}

export function scanViews() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) {
          continue;
        }
        observer?.unobserve(entry.target);
        const event = entry.target.dataset.trackView;
        if (event) {
          track(event, {
            location: trackLocation(entry.target, window.location.pathname),
          });
        }
      }
    },
    { rootMargin: "0px 0px -40% 0px" },
  );
  for (const element of document.querySelectorAll<HTMLElement>(
    "[data-track-view]:not([data-track-seen])",
  )) {
    element.dataset.trackSeen = "";
    observer.observe(element);
  }
}

function optedOut() {
  return (
    navigator.doNotTrack === "1" ||
    ("globalPrivacyControl" in navigator &&
      navigator.globalPrivacyControl === true)
  );
}

export async function startAnalytics() {
  if (started) return;
  started = true;
  document.addEventListener("click", onClick);
  scanViews();

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || optedOut()) {
    connectAnalytics(null);
    return;
  }

  const { default: posthog } = await import("posthog-js/dist/module.slim");
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || DEFAULT_HOST,
    defaults: "2026-08-30",
    persistence: "memory",
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: false,
    autocapture: false,
    capture_dead_clicks: false,
    rageclick: false,
    capture_heatmaps: false,
    capture_exceptions: false,
    disable_session_recording: true,
    disable_surveys: true,
    disable_product_tours: true,
    disable_conversations: true,
    disable_web_experiments: true,
    disable_external_dependency_loading: true,
    advanced_disable_flags: true,
    mask_personal_data_properties: true,
    respect_dnt: true,
  });
  connectAnalytics(posthog);
}
