import { getTranslations } from "next-intl/server";

import {
  CallMock,
  HandoverMock,
  QuoteMock,
  UpdateMock,
} from "@/components/ui-kit/method-mocks";
import { MethodSteps } from "@/components/ui-kit/method-steps";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import type { Translate } from "@/i18n/message-list";
import type { Locale } from "@/i18n/routing";
import { getOfferCopy } from "@/lib/offer-copy";
import { formatPrice, getOfferPrice, type OfferId } from "@/lib/offers";

const FOUNDER_PHOTO = "/team/maxime-mansiet.jpg";

export type MethodStepCopy = { when: string; title: string; body: string };

type MethodStepTuple = [
  MethodStepCopy,
  MethodStepCopy,
  MethodStepCopy,
  MethodStepCopy,
];

export function fourSteps(steps: MethodStepCopy[]): MethodStepTuple {
  const [call, quote, build, handover] = steps;
  if (steps.length !== 4 || !call || !quote || !build || !handover) {
    throw new Error(`Expected 4 method steps, got ${steps.length}`);
  }
  return [call, quote, build, handover];
}

export async function MethodSection({
  locale,
  title,
  intro,
  steps,
  quote,
  updates,
}: {
  locale: Locale;
  title: string;
  intro: string;
  steps: MethodStepTuple;
  quote: { title: string; items: string[]; excluded: string; offer: OfferId };
  updates: [string, string, string];
}) {
  const t = await getTranslations({
    locale,
    namespace: "useCases.method.mocks",
  });
  const offersT = (await getTranslations({
    locale,
    namespace: "offers",
  })) as Translate;
  const [call, estimate, build, handover] = steps;

  return (
    <PageSection id="methode">
      <SectionHeader title={title} intro={intro} />
      <MethodSteps
        className="mt-12"
        steps={[
          {
            ...call,
            mock: (
              <CallMock
                month={t("call.month")}
                day={t("call.day")}
                title={t("call.title")}
                time={t("call.time")}
                people={t("call.people")}
                avatar={FOUNDER_PHOTO}
              />
            ),
          },
          {
            ...estimate,
            mock: (
              <QuoteMock
                label={t("quoteLabel")}
                title={quote.title}
                items={quote.items}
                excluded={quote.excluded}
                total={t("total", {
                  duration: getOfferCopy(offersT, locale, quote.offer).duration,
                })}
                price={formatPrice(getOfferPrice(quote.offer), locale)}
              />
            ),
          },
          {
            ...build,
            mock: (
              <UpdateMock
                from={t("update.from")}
                time={t("update.time")}
                title={t("update.title")}
                next={t("update.next")}
                channel={t("update.channel")}
                avatar={FOUNDER_PHOTO}
                items={updates.map((label, i) => ({ label, done: i < 2 }))}
              />
            ),
          },
          {
            ...handover,
            mock: (
              <HandoverMock
                title={t("handover.title")}
                live={t("handover.live")}
                items={["a", "b", "c", "d"].map((id) =>
                  t(`handover.items.${id}`),
                )}
              />
            ),
          },
        ]}
      />
    </PageSection>
  );
}
