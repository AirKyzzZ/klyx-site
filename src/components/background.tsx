import type { ReactNode } from "react";

type BackgroundProps = {
  children: ReactNode;
  variant?: "top" | "bottom";
  className?: string;
};

export function Background({ children, className }: BackgroundProps) {
  return <div className={className}>{children}</div>;
}
