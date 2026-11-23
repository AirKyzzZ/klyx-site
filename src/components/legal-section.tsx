import type { ReactNode } from "react";

import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-shot={id}
      aria-labelledby={`${id}-title`}
      className="grid scroll-mt-28 gap-4 py-8 lg:grid-cols-[minmax(0,420px)_minmax(0,684px)] lg:justify-between lg:gap-16 lg:py-10"
    >
      <h2
        id={`${id}-title`}
        className="text-text text-[1.25rem] leading-tight font-semibold tracking-[-0.4px] sm:text-[1.375rem] sm:tracking-[-0.5px]"
      >
        <a href={`#${id}`} className="group/anchor">
          {title}
          <span
            aria-hidden="true"
            className="text-text-3 ml-2 opacity-0 transition-opacity duration-(--d-fast) group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100"
          >
            #
          </span>
        </a>
      </h2>
      <div className="text-text-2 max-w-[68ch] space-y-3 text-base leading-[1.65]">
        {children}
      </div>
    </section>
  );
}

export function LegalArticle({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageSection
        divider={false}
        containerClassName="pt-32 pb-14 md:pt-40 lg:pt-44 lg:pb-20"
      >
        <SectionHeader as="h1" title={title} intro={intro}>
          <p className="text-text-3 text-sm">{updated}</p>
        </SectionHeader>
      </PageSection>
      <PageSection id="document" containerClassName="py-10 lg:py-14">
        <article className="divide-line flex flex-col divide-y">
          {children}
        </article>
      </PageSection>
    </>
  );
}
