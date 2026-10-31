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
      <div className="relative mt-12 md:mt-16">
        <div
          aria-hidden="true"
          className="bg-line absolute top-[5px] right-0 left-0 hidden h-px lg:block"
        >
          <div className="process-fill bg-accent h-full origin-left" />
        </div>
        <ol className="grid gap-0 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="border-line relative border-l pb-10 pl-6 last:pb-0 lg:border-l-0 lg:pt-10 lg:pb-0 lg:pl-0"
            >
              <span
                aria-hidden="true"
                className="bg-bg border-accent absolute top-1 -left-[5.5px] size-[11px] rounded-full border-2 lg:top-0 lg:left-0"
              />
              <p className="type-label text-text-3">
                <span className="text-text-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </p>
              <h3 className="type-h3 mt-3">{step.title}</h3>
              <p className="text-text-2 mt-2 max-w-[34ch] text-[0.9375rem] leading-normal">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
