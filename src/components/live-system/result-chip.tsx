import { Check } from "lucide-react";

export function ResultChip({ children }: { children: string }) {
  return (
    <p className="ls-chip" data-chip="" data-shown="true">
      <Check aria-hidden="true" strokeWidth={2} />
      <span>{children}</span>
    </p>
  );
}
