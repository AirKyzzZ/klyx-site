import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageSection } from "@/components/ui-kit/page-section";
import { messageStrings } from "@/i18n/message-list";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { FDE_DEFINITION_SLUG } from "@/lib/offer-block-data";

import { InfoCard } from "./info-card";

export async function FdeDefinition({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "fde" });

  return (
    <PageSection id="definition">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
        <div className="flex flex-col gap-6">
          <h2 className="type-section max-w-[680px]">
            {t("definition.title")}
          </h2>
          <p className="type-intro text-text-2 max-w-[620px]">
            {t("definition.body")}
          </p>
          <Link
            href={{
              pathname: "/blog/[slug]",
              params: { slug: FDE_DEFINITION_SLUG },
            }}
            className="text-accent hover:text-accent-hover inline-flex w-fit items-center gap-1.5 text-[0.9375rem] font-medium underline decoration-1 underline-offset-[3px]"
          >
            {t("definition.link")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          <InfoCard title={t("audience.title")} body={t("audience.body")} />
          <InfoCard title={t("limits.title")} body={t("limits.body")}>
            <ul className="border-line mt-3 flex flex-col gap-2 border-t pt-4">
              {messageStrings(t, "limits.items").map((item) => (
                <li
                  key={item}
                  className="text-text-2 flex items-center gap-2.5 text-[0.9375rem]"
                >
                  <span
                    aria-hidden="true"
                    className="bg-line-strong h-px w-3 shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>
      </div>
    </PageSection>
  );
}
