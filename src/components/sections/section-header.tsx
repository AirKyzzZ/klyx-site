import { DashedLine } from "@/components/dashed-line";

type SectionHeaderProps = {
  label?: string;
  title: string;
  subtitle?: string;
};

export function DashedLabel({ label }: { label: string }) {
  return (
    <div className="relative mb-10 flex items-center justify-center lg:mb-16">
      <DashedLine className="text-muted-foreground" />
      <span className="bg-background text-muted-foreground absolute px-3 font-mono text-sm font-medium tracking-wide uppercase max-md:hidden">
        {label}
      </span>
    </div>
  );
}

export function SectionHeader({ label, title, subtitle }: SectionHeaderProps) {
  return (
    <>
      {label && <DashedLabel label={label} />}
      <div className="mx-auto grid max-w-5xl items-center gap-3 md:gap-8 lg:grid-cols-2">
        <h2 className="text-3xl tracking-tight text-balance md:text-4xl lg:text-5xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground leading-snug">{subtitle}</p>
        )}
      </div>
    </>
  );
}
