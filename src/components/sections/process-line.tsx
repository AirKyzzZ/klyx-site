import { Section, SectionHeading } from "@/components/section";

type ProcessLineProps = {
  index: string;
  eyebrow: string;
  title: string;
  emphasis?: string;
  steps: { title: string; body: string }[];
};

export function ProcessLine({
  index,
  eyebrow,
  title,
  emphasis,
  steps,
}: ProcessLineProps) {
  return (
    <Section index={index} eyebrow={eyebrow}>
      <SectionHeading lead={title} rest={emphasis} className="reveal" />
      <ol className="reveal border-line-strong bg-surface-1 shadow-card mt-12 overflow-hidden rounded-md border md:mt-16">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="border-line grid gap-x-6 gap-y-2 border-t px-5 py-5 first:border-t-0 md:grid-cols-[3rem_minmax(0,15rem)_minmax(0,1fr)] md:items-baseline lg:px-7 lg:py-6"
          >
            <span className="type-data text-text-3">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-text text-[1.0625rem] font-medium tracking-[-0.015em]">
              {step.title}
            </h3>
            <p className="text-text-2 max-w-[62ch] text-[0.9375rem] leading-normal">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
