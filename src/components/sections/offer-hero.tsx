import { type CSSProperties, Fragment } from "react";

import { ArrowRight } from "lucide-react";

import { ActionButton } from "@/components/action-button";
import { EmphasisTitle } from "@/components/emphasis-title";
import { LiveSystem } from "@/components/live-system/live-system";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { ScenarioId, StaticPathname } from "@/lib/scenarios";

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

export function OfferHero({
  locale,
  breadcrumbLabel,
  trail,
  current,
  anchorPrice,
  title,
  emphasis,
  serif,
  subtitle,
  primaryLabel,
  secondaryLabel,
  scenario,
}: {
  locale: Locale;
  breadcrumbLabel: string;
  trail: { href: StaticPathname; label: string }[];
  current: string;
  anchorPrice: string;
  title: string;
  emphasis?: string;
  serif?: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
  scenario: ScenarioId;
}) {
  return (
    <section className="relative pt-24 pb-16 md:pt-28 md:pb-24">
      <div className="container grid gap-12 xl:grid-cols-12 xl:items-center xl:gap-6">
        <div className="xl:col-span-5">
          <nav
            aria-label={breadcrumbLabel}
            className="hero-in"
            style={delay(0)}
          >
            <ol className="type-label text-text-3 flex flex-wrap gap-2">
              {trail.map((item) => (
                <Fragment key={item.href}>
                  <li>
                    <Link
                      href={item.href}
                      className="hover:text-text transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                </Fragment>
              ))}
              <li aria-current="page" className="text-text-2">
                {current}
              </li>
            </ol>
          </nav>
          <p
            className="hero-in type-label text-accent mt-6"
            style={delay(0.08)}
          >
            {anchorPrice}
          </p>
          <h1 className="type-h1 mt-3 max-w-[20ch]">
            <EmphasisTitle title={title} emphasis={emphasis} serif={serif} />
          </h1>
          <p
            className="hero-in type-lead text-text-2 mt-5 max-w-[54ch]"
            style={delay(0.15)}
          >
            {subtitle}
          </p>
          <div
            className="hero-in mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={delay(0.3)}
          >
            <ActionButton action="book" size="lg" className="w-full sm:w-auto">
              {primaryLabel}
            </ActionButton>
            <ActionButton
              action="quote"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {secondaryLabel}
              <ArrowRight />
            </ActionButton>
          </div>
        </div>
        <div className="hero-in xl:col-span-7" style={delay(0.45)}>
          <LiveSystem
            scenarioIds={[scenario]}
            initial={scenario}
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
