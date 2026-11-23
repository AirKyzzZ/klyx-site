import { cn } from "@/lib/utils";

export function AgentPill({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-accent text-accent-ink inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs leading-none font-medium whitespace-nowrap",
        className,
      )}
    >
      <span aria-hidden="true" className="bg-accent-ink size-1.5 rounded-full" />
      {label}
    </span>
  );
}

export function FlowLine({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("bg-line-strong h-[1.5px] w-4 shrink sm:w-10", className)}
    />
  );
}
