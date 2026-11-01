import { ProofCard } from "@/components/proof/proof-card";
import { Section, SectionHeading } from "@/components/section";
import type { Locale } from "@/i18n/routing";
import { isVerified, type ProofSource, selectStripProof } from "@/lib/proof";

const MIN_SOURCES = 2;

export function hasProofStrip(sources: ProofSource[]): boolean {
  return selectStripProof(sources.filter(isVerified)).length >= MIN_SOURCES;
}

export function ProofStrip({
  sources,
  locale,
  title,
  emphasis,
  index,
  eyebrow,
}: {
  sources: ProofSource[];
  locale: Locale;
  title: string;
  emphasis: string;
  index?: string;
  eyebrow?: string;
}) {
  if (!hasProofStrip(sources)) return null;
  const selected = selectStripProof(sources.filter(isVerified));

  return (
    <Section index={index} eyebrow={eyebrow}>
      <SectionHeading lead={title} rest={emphasis} className="reveal" />
      <ul className="reveal -mx-(--content-x) mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--content-x) pb-2 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
        {selected.map((source) => (
          <li
            key={source.kind}
            className="w-[300px] shrink-0 snap-start md:w-auto"
          >
            <ProofCard source={source} locale={locale} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
