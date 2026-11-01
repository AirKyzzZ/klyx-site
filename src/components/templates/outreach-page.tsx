import type { CSSProperties } from "react";

import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { CalBooking } from "@/components/cal-booking";
import { EmphasisTitle } from "@/components/emphasis-title";
import { LiveSystem } from "@/components/live-system/live-system";
import { Section, SectionHeading } from "@/components/section";
import { CaseCard } from "@/components/sections/case-grid";
import { OfferLedger } from "@/components/sections/offer-ledger";
import type { Translate } from "@/i18n/message-list";
import { getCaseStudies } from "@/lib/content";
import { getOfferCopy } from "@/lib/offer-copy";
import {
  OUTREACH_CTA,
  OUTREACH_EMAIL_LINE,
  OUTREACH_PROOF_LINE,
  type OutreachPageConfig,
  type OutreachSection,
} from "@/lib/outreach-pages";
import { site } from "@/lib/site";

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

function BookRow({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ActionButton action="book" size="lg" className="w-full sm:w-auto">
        {OUTREACH_CTA}
      </ActionButton>
      <p className="type-label text-text-3 mt-4">{OUTREACH_PROOF_LINE}</p>
    </div>
  );
}

function OutreachHero({ config }: { config: OutreachPageConfig }) {
  const { hero, scenario } = config;
  return (
    <section
      data-shot="hero"
      className="relative pt-24 pb-16 md:pt-28 md:pb-24"
    >
      <div className="container grid gap-12 xl:grid-cols-12 xl:items-center xl:gap-6">
        <div className="xl:col-span-5">
          <p className="hero-in type-label text-accent" style={delay(0)}>
            {hero.anchor}
          </p>
          <h1 className="type-h1 mt-3 max-w-[20ch]">
            <EmphasisTitle
              title={hero.title}
              emphasis={hero.emphasis}
              serif={hero.serif}
            />
          </h1>
          <p
            className="hero-in type-lead text-text-2 mt-5 max-w-[54ch]"
            style={delay(0.15)}
          >
            {hero.subtitle}
          </p>
          <div className="hero-in" style={delay(0.3)}>
            <BookRow className="mt-7" />
          </div>
        </div>
        <div className="hero-in xl:col-span-7" style={delay(0.45)}>
          <LiveSystem scenarioIds={[scenario]} initial={scenario} locale="fr" />
        </div>
      </div>
    </section>
  );
}

function SectionIntro({
  section,
  body,
}: {
  section: OutreachSection;
  body?: string;
}) {
  return (
    <div className="reveal content-start space-y-6 lg:col-span-5">
      <SectionHeading lead={section.title} rest={section.emphasis} />
      {body && <p className="text-text-2 max-w-[48ch]">{body}</p>}
    </div>
  );
}

async function SectionBody({ section }: { section: OutreachSection }) {
  if (section.kind === "list") {
    return (
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <SectionIntro section={section} body={section.body} />
        <ol className="reveal type-data self-start lg:col-span-6 lg:col-start-7">
          {section.items.map((item, i) => (
            <li
              key={item.body}
              className="border-line flex gap-4 border-b py-4 first:border-t"
            >
              <span className="text-accent w-6 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="font-sans text-[0.9375rem] leading-snug">
                {item.title && (
                  <p className="text-text font-medium">{item.title}</p>
                )}
                <p className={item.title ? "text-text-2 mt-1" : "text-text"}>
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (section.kind === "pricing") {
    const offersT = (await getTranslations({
      locale: "fr",
      namespace: "offers",
    })) as Translate;
    const labels = await getTranslations({
      locale: "fr",
      namespace: "useCases.labels",
    });
    return (
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <SectionIntro section={section} body={section.body} />
        <div className="reveal lg:col-span-6 lg:col-start-7">
          <OfferLedger
            rows={section.offers.map((id) => getOfferCopy(offersT, "fr", id))}
            labels={{
              offer: labels("offer"),
              duration: labels("duration"),
              price: labels("amount"),
            }}
            caption={offersT("vatNote")}
          />
        </div>
      </div>
    );
  }

  const readLabel = (
    await getTranslations({ locale: "fr", namespace: "cases.labels" })
  )("read");
  const cases = (await getCaseStudies("fr")).filter((study) =>
    section.slugs.includes(study.slug),
  );
  return (
    <div className="reveal tone-sand relative grid gap-10 rounded-xl p-6 md:p-10 lg:grid-cols-12 lg:gap-6 lg:p-12">
      <div className="content-start space-y-6 lg:col-span-7">
        <SectionHeading lead={section.title} rest={section.emphasis} />
        <p className="text-text-2 max-w-[48ch]">{section.body}</p>
      </div>
      <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:col-span-12">
        {cases.map((study) => (
          <li key={study.slug}>
            <CaseCard
              item={study}
              readLabel={readLabel}
              sizes="(min-width: 1024px) 540px, 90vw"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Booking({ config }: { config: OutreachPageConfig }) {
  const { booking } = config;
  return (
    <Section id="reserver" eyebrow={booking.eyebrow}>
      <div className="reveal border-line-strong bg-surface-1 shadow-card grid gap-10 rounded-xl border px-5 py-10 sm:px-8 md:px-12 md:py-14 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="space-y-5 lg:col-span-6">
          <SectionHeading lead={booking.title} rest={booking.emphasis} />
          <p className="text-text-2 max-w-[46ch]">{booking.body}</p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          {site.calUrl ? (
            <CalBooking
              calUrl={site.calUrl}
              label={OUTREACH_CTA}
              title={OUTREACH_CTA}
            />
          ) : (
            <ActionButton action="book" size="lg" className="w-full">
              {OUTREACH_CTA}
            </ActionButton>
          )}
          <p className="text-text-2 mt-5 text-sm">
            {OUTREACH_EMAIL_LINE}{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-text underline underline-offset-4"
            >
              {site.email}
            </a>
          </p>
          <p className="type-label text-text-3 mt-3">{OUTREACH_PROOF_LINE}</p>
        </div>
      </div>
    </Section>
  );
}

export function OutreachPage({ config }: { config: OutreachPageConfig }) {
  return (
    <>
      <OutreachHero config={config} />
      {config.sections.map((section, i) => (
        <Section
          key={section.id}
          index={String(i + 1).padStart(2, "0")}
          eyebrow={section.eyebrow}
        >
          <SectionBody section={section} />
          {section.id === config.midCtaAfter && (
            <BookRow className="reveal mt-12" />
          )}
        </Section>
      ))}
      <Booking config={config} />
    </>
  );
}
