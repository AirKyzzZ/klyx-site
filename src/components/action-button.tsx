import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";

type ActionButtonProps = {
  action: "book" | "quote";
  children: ReactNode;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
};

export function ActionButton({
  action,
  children,
  variant,
  size,
  className,
}: ActionButtonProps) {
  const calUrl = action === "book" ? site.calUrl : undefined;
  return (
    <Button variant={variant} size={size} className={className} asChild>
      {calUrl ? (
        <a href={calUrl} target="_blank" rel="noopener">
          {children}
        </a>
      ) : (
        <Link href="/contact">{children}</Link>
      )}
    </Button>
  );
}
