"use client";

import { useEffect } from "react";

export function ProcessSpy({ ids }: { ids: string[] }) {
  useEffect(() => {
    if (!matchMedia("(min-width: 1024px)").matches) return;

    const links = new Map(
      ids.map((id) => [id, document.querySelector(`[data-spy-link="${id}"]`)]),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const [id, link] of links) {
            link?.toggleAttribute("data-active", id === entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ids) {
      const article = document.getElementById(id);
      if (article) observer.observe(article);
    }
    return () => observer.disconnect();
  }, [ids]);

  return null;
}
