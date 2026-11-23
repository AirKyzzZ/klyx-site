import { Check, Minus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { BookingCard } from "@/components/ui-kit/booking-card";
import { CaseRow } from "@/components/ui-kit/case-row";
import { CenteredHero } from "@/components/ui-kit/centered-hero";
import { ClientsRow } from "@/components/ui-kit/clients-row";
import { ConstellationBackdrop } from "@/components/ui-kit/constellation-backdrop";
import { FinalCta } from "@/components/ui-kit/final-cta";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { getCaseStudies } from "@/lib/content";
import { HOME_CLIENTS } from "@/lib/home-sections";
import {
  OUTREACH_CLIENTS_LABEL,
  OUTREACH_CTA,
  OUTREACH_EMAIL_LINE,
  OUTREACH_LABELS,
  OUTREACH_PROOF_LINE,
  type OutreachPageConfig,
  type OutreachSection,
} from "@/lib/outreach-pages";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

import { PriceCards } from "./price-cards";

const FOUNDER_PHOTO = "/team/maxime-mansiet.jpg";
const BOOKING_DAYS = [
  { id: "mon", date: 2 },
  { id: "tue", date: 3 },
  { id: "wed", date: 4 },
  { id: "thu", date: 5 },
] as const;
const BOOKING_SLOTS = ["09:30", "11:00", "14:00", "16:30"];

function BookButton({ className }: { className?: string }) {
  return (
    <ActionButton
      action="book"
      size="xl"
      className={className}
      trackLocation="outreach_page"
    >
      {OUTREACH_CTA}
    </ActionButton>
  );
}

function ListPanel({
  section,
}: {
  section: Extract<OutreachSection, { kind: "list" }>;
}) {
  const Icon = section.tone === "limit" ? Minus : Check;
  return (
    <ul className="border-line bg-surface-1 divide-line divide-y overflow-hidden rounded-[16px] border">
      {section.items.map((item) => (
        <li
          key={item.body}
          className={cn(
            "grid gap-2 px-6 py-5 lg:px-8",
            item.title
              ? "lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-12"
              : "grid-cols-[auto_1fr] items-start gap-4",
          )}
        >
          {item.title ? (
            <h3 className="text-text text-lg leading-tight font-semibold tracking-[-0.3px]">
              {item.title}
            </h3>
          ) : (
            <span
              className={cn(
                "mt-0.5 grid size-5 place-items-center rounded-full",
                section.tone === "limit"
                  ? "bg-surface-2 text-text-3"
                  : "bg-accent-tint text-accent",
              )}
            >
              <Icon aria-hidden="true" className="size-3" strokeWidth={2.5} />
            </span>
          )}
          <p
            className={cn(
              "text-[0.9375rem] leading-normal",
              item.title ? "text-text-2" : "text-text",
            )}
          >
            {item.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

async function SectionBody({ section }: { section: OutreachSection }) {
  if (section.kind === "list") return <ListPanel section={section} />;

  if (section.kind === "steps") {
    return (
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {section.items.map((item, i) => (
          <li
            key={item.title}
            className="border-line bg-surface-1 shadow-panel flex flex-col gap-3 rounded-[16px] border p-6"
          >
            <span
              className={cn(
                "grid size-10 place-items-center rounded-full text-base font-semibold tabular-nums",
                i === 0
                  ? "bg-accent text-accent-ink"
                  : "border-line-strong text-text bg-surface-1 border",
              )}
            >
              {i + 1}
            </span>
            <h3 className="text-text mt-2 text-[1.3125rem] leading-tight font-semibold tracking-[-0.4px]">
              {item.title}
            </h3>
            <p className="text-text-2 text-[0.9375rem] leading-normal">
              {item.body}
            </p>
          </li>
        ))}
      </ol>
    );
  }

  if (section.kind === "pricing") {
    return (
      <PriceCards
        locale="fr"
        labels={{ ...OUTREACH_LABELS, perDay: "" }}
        cards={section.offers}
      />
    );
  }

  const studies = await getCaseStudies("fr");
  const cases = section.slugs.flatMap((slug) => {
    const study = studies.find((item) => item.slug === slug);
    return study ? [study] : [];
  });
  return (
    <div className="flex flex-col">
      {cases.map((study) => (
        <CaseRow
          key={study.slug}
          slug={study.slug}
          name={study.title}
          kind={study.client}
          summary={study.summary}
          meta={[...study.stack.slice(0, 2), study.year].join(", ")}
          image={study.image}
        />
      ))}
    </div>
  );
}

async function Booking({ config }: { config: OutreachPageConfig }) {
  const t = await getTranslations({ locale: "fr", namespace: "home" });
  return (
    <PageSection id="reserver">
      <FinalCta
        title={config.booking.title}
        body={config.booking.body}
        actions={
          <p className="text-text-2 text-[0.9375rem]">
            {OUTREACH_EMAIL_LINE}{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-text hover:text-accent font-medium underline decoration-1 underline-offset-[3px] transition-colors duration-(--d-fast)"
            >
              {site.email}
            </a>
          </p>
        }
        aside={
          <BookingCard
            avatar={FOUNDER_PHOTO}
            labels={{
              name: t("team.name"),
              role: t("cta.booking.role"),
              message: t("cta.booking.message"),
              pick: t("cta.booking.pick"),
              sample: t("cta.booking.sample"),
              video: t("cta.booking.video"),
              free: t("cta.booking.free"),
              noCommitment: t("cta.booking.noCommitment"),
            }}
            days={BOOKING_DAYS.map(({ id, date }) => ({
              id,
              date,
              short: t(`cta.booking.days.${id}.short`),
              long: t(`cta.booking.days.${id}.long`),
            }))}
            slots={BOOKING_SLOTS}
            buttonTemplate={OUTREACH_CTA}
          />
        }
      />
    </PageSection>
  );
}

export function OutreachPage({ config }: { config: OutreachPageConfig }) {
  const { hero, backdrop } = config;
  return (
    <>
      <CenteredHero
        title={hero.title}
        subtitle={hero.subtitle}
        backdrop={
          <ConstellationBackdrop
            sources={backdrop.sources}
            destinations={backdrop.destinations}
          />
        }
        actions={
          <>
            <BookButton />
            <p className="text-text-3 basis-full text-[0.8125rem]">
              {hero.note}
            </p>
          </>
        }
        footer={
          <ClientsRow label={OUTREACH_CLIENTS_LABEL} names={HOME_CLIENTS} />
        }
      />
      {config.sections.map((section) => (
        <PageSection key={section.id} id={section.id}>
          <SectionHeader title={section.title} intro={section.body} />
          <div className="mt-12">
            <SectionBody section={section} />
          </div>
          {section.id === config.midCtaAfter && (
            <div className="mt-12 flex flex-col items-center gap-3 text-center">
              <BookButton />
              <p className="text-text-3 text-[0.8125rem] tabular-nums">
                {OUTREACH_PROOF_LINE}
              </p>
            </div>
          )}
        </PageSection>
      ))}
      <Booking config={config} />
    </>
  );
}
