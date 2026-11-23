"use client";

import { type ReactNode, useEffect, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

function isEnglishPath() {
  const path = window.location.pathname;
  return path === "/en" || path.startsWith("/en/");
}

export function NotFoundLocale({
  fr,
  en,
  enTitle,
}: {
  fr: ReactNode;
  en: ReactNode;
  enTitle: string;
}) {
  const english = useSyncExternalStore(
    noopSubscribe,
    isEnglishPath,
    () => false,
  );
  useEffect(() => {
    if (english) document.title = enTitle;
  }, [english, enTitle]);
  return english ? en : fr;
}
