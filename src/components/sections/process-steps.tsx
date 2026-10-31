import { DashedLine } from "@/components/dashed-line";
import { cn } from "@/lib/utils";

type ProcessStepsProps = {
  title: string;
  steps: { title: string; body: string }[];
  className?: string;
};

export function ProcessSteps({ title, steps, className }: ProcessStepsProps) {
  return (
    <section className={cn("overflow-hidden pb-28 lg:pb-32", className)}>
      <h2 className="container text-center text-3xl tracking-tight text-balance md:text-4xl lg:text-5xl">
        {title}
      </h2>

      <div className="mt-8 md:mt-12 lg:mt-20">
        <DashedLine
          orientation="horizontal"
          className="container scale-x-105"
        />
        <ol className="relative container grid md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative flex flex-col gap-4 py-6 md:px-6 md:py-8"
            >
              <span className="text-muted-foreground font-mono text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="text-balance">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
              {i < steps.length - 1 && (
                <>
                  <DashedLine
                    orientation="vertical"
                    className="absolute top-0 right-0 max-lg:hidden"
                  />
                  <DashedLine
                    orientation="horizontal"
                    className="absolute inset-x-0 bottom-0 md:hidden"
                  />
                </>
              )}
            </li>
          ))}
        </ol>
        <DashedLine
          orientation="horizontal"
          className="container scale-x-105"
        />
      </div>
    </section>
  );
}
