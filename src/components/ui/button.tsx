import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-sm font-medium tracking-[-0.01em] whitespace-nowrap transition-[background-color,border-color,color,transform] duration-(--d-fast) ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-(--d-fast) hover:[&_svg:last-child]:translate-x-0.5 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.22)] hover:bg-accent-hover",
        secondary:
          "border border-line-strong bg-transparent text-text hover:border-text-3 hover:bg-surface-1",
        ghost: "text-text-2 hover:text-text",
      },
      size: {
        md: "h-9 px-3.5 text-sm",
        lg: "h-11 px-4.5 text-[0.9375rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
