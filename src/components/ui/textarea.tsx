import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-line-strong bg-surface-2 text-text placeholder:text-text-3 hover:border-text-3 focus-visible:border-text-3 aria-invalid:border-ui-err flex field-sizing-content min-h-16 w-full min-w-0 rounded-sm border px-3.5 py-3 text-base shadow-[inset_0_1px_0_var(--highlight)] transition-colors duration-(--d-fast) disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[0.9375rem]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
