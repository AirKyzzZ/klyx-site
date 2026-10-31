import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { getOfferCopy } from "@/lib/offer-copy";
import { PRICE_GROUPS } from "@/lib/offers";
import { cn } from "@/lib/utils";

export function PriceLedger({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const t = getStaticTranslator(locale, "pricing");
  const offersT = getStaticTranslator(locale, "offers");

  return (
    <div
      className={cn(
        "border-line bg-surface-1 shadow-card overflow-hidden rounded-md border",
        className,
      )}
    >
      <table className="w-full text-left max-md:block">
        <caption className="sr-only">{offersT("vatNote")}</caption>
        <thead className="max-md:sr-only">
          <tr className="type-label text-text-3">
            <th scope="col" className="py-4 pr-4 pl-7 font-medium">
              {t("table.offer")}
            </th>
            <th scope="col" className="py-4 pr-4 font-medium">
              {t("table.includes")}
            </th>
            <th scope="col" className="py-4 pr-4 font-medium">
              {t("table.duration")}
            </th>
            <th scope="col" className="py-4 pr-7 text-right font-medium">
              {t("table.price")}
            </th>
          </tr>
        </thead>
        {PRICE_GROUPS.map((group, g) => (
          <tbody key={group.key} className="max-md:block">
            <tr className="border-line bg-bg-sunken/40 border-t max-md:block">
              <th
                scope="colgroup"
                colSpan={4}
                className="type-label text-text-2 block px-5 py-3 font-medium md:table-cell md:px-7"
              >
                <span className="text-accent">
                  {String(g + 1).padStart(2, "0")}
                </span>
                <span className="text-text-3"> / </span>
                {t(`table.groups.${group.key}`)}
              </th>
            </tr>
            {group.offers.map((id) => {
              const row = getOfferCopy(offersT, locale, id);
              const todo = row.price.startsWith("TODO(maxime)");
              return (
                <tr
                  key={id}
                  className="group/row border-line hover:bg-surface-3 relative border-t transition-colors duration-(--d-fast) max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-x-4 max-md:gap-y-1 max-md:px-5 max-md:py-4"
                >
                  <th
                    scope="row"
                    className="py-4 pr-4 align-top font-medium max-md:p-0 md:pl-7"
                  >
                    <Link
                      href={row.href}
                      className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-(--accent)"
                    >
                      {row.name}
                    </Link>
                  </th>
                  <td className="text-text-2 py-4 pr-4 align-top text-[0.9375rem] leading-snug max-md:order-3 max-md:col-span-2 max-md:mt-1 max-md:p-0">
                    {row.summary}
                  </td>
                  <td className="type-data text-text-3 py-4 pr-4 align-top max-md:order-4 max-md:col-span-2 max-md:p-0 md:whitespace-nowrap">
                    {row.duration}
                  </td>
                  <td
                    className={cn(
                      "type-data py-4 text-right align-top max-md:order-2 max-md:p-0 md:pr-7",
                      todo
                        ? "text-text-3 max-w-[22ch] text-xs max-md:max-w-[14ch]"
                        : "text-text whitespace-nowrap",
                    )}
                  >
                    <span className="inline-flex items-start gap-2">
                      {row.price}
                      <ArrowRight
                        aria-hidden="true"
                        className="text-text-3 group-hover/row:text-text mt-0.5 size-3.5 shrink-0 transition-[color,translate] duration-(--d-fast) group-hover/row:translate-x-0.5 max-md:hidden"
                      />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
}
