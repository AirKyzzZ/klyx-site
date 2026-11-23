import { getLocale, getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { BookingCard } from "@/components/ui-kit/booking-card";
import { FinalCta } from "@/components/ui-kit/final-cta";
import { PageSection } from "@/components/ui-kit/page-section";
import type { Locale } from "@/i18n/routing";

const FOUNDER_PHOTO = "/team/maxime-mansiet.jpg";

const BOOKING_DAYS = [
  { id: "mon", date: 2 },
  { id: "tue", date: 3 },
  { id: "wed", date: 4 },
  { id: "thu", date: 5 },
] as const;
const BOOKING_SLOTS = ["09:30", "11:00", "14:00", "16:30"];

export async function SiteCta({
  id = "contact",
  title,
  body,
  secondaryLabel,
}: {
  id?: string;
  title?: string;
  body?: string;
  secondaryLabel?: string;
}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <PageSection id={id}>
      <FinalCta
        title={title ?? t("cta.title")}
        body={body ?? t("cta.body")}
        actions={
          <ActionButton
            action="quote"
            variant="outline"
            size="xl"
            trackLocation="final-cta"
            className="h-12 rounded-[10px] px-[22px]"
          >
            {secondaryLabel ?? t("cta.secondary")}
          </ActionButton>
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
            days={BOOKING_DAYS.map(({ id: day, date }) => ({
              id: day,
              date,
              short: t(`cta.booking.days.${day}.short`),
              long: t(`cta.booking.days.${day}.long`),
            }))}
            slots={BOOKING_SLOTS}
            buttonTemplate={String(t.raw("cta.booking.button"))}
          />
        }
      />
    </PageSection>
  );
}
