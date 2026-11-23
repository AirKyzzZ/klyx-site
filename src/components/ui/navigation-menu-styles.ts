import { cva } from "class-variance-authority";

export const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background p-2 text-sm font-medium transition-colors hover:bg-surface-3 focus:bg-surface-3 disabled:pointer-events-none disabled:opacity-50 data-active:bg-surface-3 data-[state=open]:bg-surface-3",
);
