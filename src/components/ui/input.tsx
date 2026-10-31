import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-line-strong bg-surface-2 text-text placeholder:text-text-3 hover:border-text-3 focus-visible:border-text-3 aria-invalid:border-ui-err h-11 w-full min-w-0 rounded-sm border px-3.5 text-base shadow-[inset_0_1px_0_var(--highlight)] transition-colors duration-(--d-fast) file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[0.9375rem]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
