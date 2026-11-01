import { getTranslations } from "next-intl/server";

import { Section, SectionHeading } from "@/components/section";
import { messageStrings } from "@/i18n/message-list";
import type { Locale } from "@/i18n/routing";

export async function FdeDefinition({
  locale,
  index,
  eyebrow,
}: {
  locale: Locale;
  index: string;
  eyebrow: string;
}) {
  const t = await getTranslations({ locale, namespace: "fde" });

  return (
    <Section index={index} eyebrow={eyebrow}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="reveal lg:col-span-7">
          <SectionHeading
            lead={t("definition.title")}
            rest={t("definition.titleEmphasis")}
          />
          <dl className="border-line mt-10 border-l pl-6 md:mt-12">
            <dt className="type-data text-text-3">{t("definition.term")}</dt>
            <dd className="type-lead text-text mt-4 max-w-[60ch]">
              {t("definition.body")}
            </dd>
          </dl>
        </div>
        <div className="reveal space-y-6 lg:col-span-4 lg:col-start-9 lg:pt-2">
          <div className="border-line bg-surface-1 shadow-card rounded-md border p-5 lg:p-7">
            <h3 className="type-h3">{t("audience.title")}</h3>
            <p className="text-text-2 mt-2 text-[0.9375rem]">
              {t("audience.body")}
            </p>
          </div>
          <div className="border-line bg-surface-1 shadow-card rounded-md border p-5 lg:p-7">
            <h3 className="type-h3">{t("limits.title")}</h3>
            <p className="text-text-2 mt-2 text-[0.9375rem]">
              {t("limits.body")}
            </p>
            <ul className="border-line type-data mt-5 space-y-2 border-t pt-4">
              {messageStrings(t, "limits.items").map((item) => (
                <li
                  key={item}
                  className="text-text-2 flex items-baseline gap-3"
                >
                  <span
                    aria-hidden="true"
                    className="border-text-3 size-2 shrink-0 rounded-[1px] border"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
