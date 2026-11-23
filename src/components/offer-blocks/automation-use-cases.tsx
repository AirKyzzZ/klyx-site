import { getTranslations } from "next-intl/server";

import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { UseCaseCard } from "@/components/ui-kit/use-case-card";
import type { Locale } from "@/i18n/routing";
import { AUTOMATION_EXAMPLES } from "@/lib/offer-block-data";

export async function AutomationUseCases({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "automation.block" });

  return (
    <PageSection id="exemples">
      <SectionHeader title={t("title")} intro={t("intro")} />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {AUTOMATION_EXAMPLES.map(({ key, from, to }) => (
          <UseCaseCard
            key={key}
            category={t(`examples.${key}.category`)}
            title={t(`examples.${key}.title`)}
            from={from}
            to={to}
            agentLabel={t("agent")}
            before={{
              label: t("before"),
              text: t(`examples.${key}.before`),
            }}
            after={{ label: t("after"), text: t(`examples.${key}.after`) }}
            className="sm:p-6 sm:[&_dl>div]:grid-cols-1 sm:[&_dl>div]:gap-1"
          />
        ))}
      </div>
      <p className="border-line bg-surface-1 text-text-2 mt-5 rounded-[16px] border px-6 py-4 text-[0.9375rem] leading-normal">
        {t("limit")}
      </p>
    </PageSection>
  );
}
