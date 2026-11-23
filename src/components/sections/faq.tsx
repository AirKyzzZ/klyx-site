import type { ReactNode } from "react";

import { ActionButton } from "@/components/action-button";
import { FaqList } from "@/components/ui-kit/faq-list";
import { PageSection } from "@/components/ui-kit/page-section";

type FaqItem = {
  question: string;
  answer: string;
  id?: string;
  more?: ReactNode;
};

type FaqProps = {
  id?: string;
  index?: string;
  eyebrow?: string;
  title: string;
  emphasis?: string;
  intro?: string;
  items: FaqItem[];
  bookLabel?: string;
  openFirst?: boolean;
  openAll?: boolean;
  className?: string;
};

export function Faq({
  id,
  title,
  emphasis,
  intro,
  items,
  bookLabel,
  openFirst = false,
  openAll = false,
  className,
}: FaqProps) {
  return (
    <PageSection id={id} className={className}>
      <FaqList
        title={emphasis ? `${title} ${emphasis}` : title}
        intro={intro}
        items={items}
        openFirst={openFirst}
        openAll={openAll}
        aside={
          bookLabel && (
            <ActionButton
              trackLocation="faq"
              action="book"
              variant="outline"
              size="lg"
              className="self-start"
            >
              {bookLabel}
            </ActionButton>
          )
        }
      />
    </PageSection>
  );
}
