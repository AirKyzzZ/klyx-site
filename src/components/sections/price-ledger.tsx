import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { getOfferCopy } from "@/lib/offer-copy";
import { getOffer, PRICE_GROUPS } from "@/lib/offers";
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
        "border-line bg-surface-1 shadow-panel overflow-hidden rounded-[20px] border",
        className,
      )}
    >
      <table className="w-full text-left max-lg:block">
        <caption className="sr-only">{offersT("vatNote")}</caption>
        <thead className="max-lg:sr-only">
          <tr className="text-text-3 text-[0.8125rem]">
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
        {PRICE_GROUPS.map((group) => (
          <tbody key={group.key} className="max-lg:block">
            <tr className="border-line bg-surface-2 border-t max-lg:block">
              <th
                scope="colgroup"
                colSpan={4}
                className="text-text block px-5 py-3 text-[0.9375rem] font-semibold lg:table-cell lg:px-7"
              >
                {t(`table.groups.${group.key}`)}
              </th>
            </tr>
            {group.offers.map((id) => {
              const row = getOfferCopy(offersT, locale, id);
              const onQuote = getOffer(id).priceFrom === null;
              return (
                <tr
                  key={id}
                  className="group/row border-line hover:bg-surface-2/60 relative border-t transition-colors duration-(--d-fast) max-lg:grid max-lg:grid-cols-1 max-lg:gap-y-1 max-lg:px-5 max-lg:py-4"
                >
                  <th
                    scope="row"
                    className="text-text min-w-0 py-4 pr-4 align-top text-base font-semibold max-lg:p-0 lg:pl-7"
                  >
                    <Link
                      href={row.href}
                      className="group-hover/row:text-accent transition-colors duration-(--d-fast) after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-(--accent)"
                    >
                      {row.name}
                    </Link>
                  </th>
                  <td className="text-text-2 py-4 pr-4 align-top text-[0.9375rem] leading-snug max-lg:order-3 max-lg:mt-1 max-lg:min-w-0 max-lg:p-0">
                    {row.summary}
                  </td>
                  <td className="text-text-3 py-4 pr-4 align-top text-sm max-lg:order-4 max-lg:min-w-0 max-lg:p-0 lg:whitespace-nowrap">
                    {row.duration}
                  </td>
                  <td
                    className={cn(
                      "py-4 text-right align-top text-[0.9375rem] max-lg:order-2 max-lg:min-w-0 max-lg:p-0 max-lg:text-left lg:pr-7 lg:whitespace-nowrap",
                      onQuote ? "text-text-3" : "text-text font-semibold",
                    )}
                  >
                    <span className="inline-flex items-start gap-2">
                      {row.price}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="text-text-3 group-hover/row:text-accent mt-0.5 size-4 shrink-0 transition-colors duration-(--d-fast) max-lg:hidden"
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
