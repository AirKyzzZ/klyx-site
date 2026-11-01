import type { ReactNode, SVGProps } from "react";

export type LogoProps = Omit<SVGProps<SVGSVGElement>, "children">;

export function LogoSvg({
  children,
  ...props
}: LogoProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}
