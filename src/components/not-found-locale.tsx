"use client";

import { type ReactNode, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

function isEnglishPath() {
  const path = window.location.pathname;
  return path === "/en" || path.startsWith("/en/");
}

export function NotFoundLocale({ fr, en }: { fr: ReactNode; en: ReactNode }) {
  const english = useSyncExternalStore(
    noopSubscribe,
    isEnglishPath,
    () => false,
  );
  return english ? en : fr;
}
