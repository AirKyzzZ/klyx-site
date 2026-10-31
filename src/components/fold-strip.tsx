import { GitBranch, MapPin, Receipt } from "lucide-react";
import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export async function FoldStrip({
  locale,
  className,
  style,
}: {
  locale: Locale;
  className?: string;
  style?: CSSProperties;
}) {
  const t = await getTranslations({ locale, namespace: "home.fold" });
  const items = [
    { icon: GitBranch, text: t("repo") },
    { icon: Receipt, text: t("prices") },
    { icon: MapPin, text: t("siret", { siret: site.siret }) },
  ];

  return (
    <ul
      aria-label={t("label")}
      className={cn(
        "text-text-2 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-8",
        className,
      )}
      style={style}
    >
      {items.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-2">
          <Icon
            aria-hidden="true"
            className="text-text-3 size-3.5"
            strokeWidth={1.5}
          />
          {text}
        </li>
      ))}
    </ul>
  );
}
