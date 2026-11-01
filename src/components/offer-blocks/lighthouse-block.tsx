import { getTranslations } from "next-intl/server";

import { ProofCard } from "@/components/proof/proof-card";
import { Section, SectionHeading } from "@/components/section";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import { getVerifiedProof, type ProofSource } from "@/lib/proof";

const SHOT_SLUGS = ["vertiflow", "hop-hop-immo"];
const MAX_CARDS = 3;

function blockProof(sources: ProofSource[]): ProofSource[] {
  const lighthouse = sources.filter((source) => source.kind === "lighthouse");
  const shots = sources.filter(
    (source) => source.kind === "site-shot" && SHOT_SLUGS.includes(source.slug),
  );
  return [...lighthouse, ...shots].slice(0, MAX_CARDS);
}

export async function LighthouseBlock({
  locale,
  index,
  eyebrow,
}: {
  locale: Locale;
  index: string;
  eyebrow: string;
}) {
  const sources = blockProof(getVerifiedProof());
  if (sources.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "sites" });

  return (
    <Section index={index} eyebrow={eyebrow}>
      <div className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
        <SectionHeading
          lead={t("block.title")}
          rest={t("block.titleEmphasis")}
          className="lg:col-span-7"
        />
        <p className="text-text-2 max-w-[44ch] lg:col-span-4 lg:col-start-9">
          {t("block.body")}
        </p>
      </div>
      <ul
        className={cn(
          "reveal mt-12 grid gap-4 md:mt-16 md:grid-cols-2",
          sources.length > 2 && "lg:grid-cols-3",
        )}
      >
        {sources.map((source) => (
          <li key={source.kind === "site-shot" ? source.slug : source.kind}>
            <ProofCard source={source} locale={locale} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
