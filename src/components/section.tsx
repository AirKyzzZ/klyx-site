import { cn } from "@/lib/utils";

export function Hr({ className }: { className?: string }) {
  return (
    <div className={cn("hr", className)} aria-hidden="true">
      <div className="relative container h-0">
        <span className="cross l" />
        <span className="cross r" />
      </div>
    </div>
  );
}
