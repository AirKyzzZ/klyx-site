import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const ImagePlaceholder = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "from-muted-foreground/15 to-muted-foreground/5 bg-linear-to-br",
        className,
      )}
      {...props}
    />
  );
};
