import type { ReactNode } from "react";

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 space-y-3">
      <h2 className="text-2xl tracking-tight">{title}</h2>
      <div className="text-muted-foreground space-y-3 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
