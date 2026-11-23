import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { OfferLink } from "@/components/ui-kit/offer-link";
import { getLocaleHref } from "@/i18n/locale-href";
import type { Locale } from "@/i18n/routing";
import { getStaticTranslator } from "@/i18n/static-translator";
import { HOME_OFFER_CARDS } from "@/lib/home-sections";
import { formatPrice, getOffer, getOfferPrice } from "@/lib/offers";
import { PROSE_LINK } from "@/lib/prose";
import { cn } from "@/lib/utils";

import "@/components/ui-kit/ui-kit.css";

export function NotFoundView({
  locale,
  footer,
  className,
}: {
  locale: Locale;
  footer?: ReactNode;
  className?: string;
}) {
  const t = getStaticTranslator(locale, "notFound");
  const href = (pathname: string) => getLocaleHref(locale, pathname, {});

  return (
    <section
      data-shot="not-found"
      lang={locale}
      className={cn("relative z-1 overflow-hidden", className)}
    >
      <div className="relative container">
        <div className="relative isolate flex flex-col items-center pt-32 pb-14 text-center md:pt-40 lg:pt-44 lg:pb-16">
          <div
            aria-hidden="true"
            className="constellation-grid absolute inset-0 -z-1"
          />
          <p
            aria-hidden="true"
            className="text-line-strong text-[5.5rem] leading-none font-semibold tracking-[-0.05em] sm:text-[7.5rem]"
          >
            404
          </p>
          <h1 className="type-hero mt-5 max-w-[700px]">{t("title")}</h1>
          <p className="type-subtitle text-text-2 mt-6 max-w-[540px]">
            {t("body")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="xl" asChild>
              <Link href={href("/")}>{t("home")}</Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href={href("/contact")}>{t("contact")}</Link>
            </Button>
          </div>
          {footer}
        </div>

        <div className="pb-20 lg:pb-28">
          <p className="text-text-3 text-center text-sm">{t("offers")}</p>
          <ul className="mx-auto mt-5 grid max-w-[960px] gap-3 md:grid-cols-3">
            {HOME_OFFER_CARDS.map(({ key, href: page, offer }) => (
              <li key={key}>
                <OfferLink
                  href={href(page)}
                  name={t(`names.${key}`)}
                  price={t("price", {
                    price: formatPrice(getOfferPrice(offer), locale),
                    unit: getOffer(offer).unit,
                  })}
                />
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm font-medium">
            <Link href={href("/tarifs")} className={PROSE_LINK}>
              {t("pricing")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
