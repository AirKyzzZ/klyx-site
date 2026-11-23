import { BRAND_COLORS } from "@/components/logos/brand-colors";
import { ToolLogo } from "@/components/logos/tool-logo";
import type { ToolLogoId } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function LogoTile({
  logo,
  size = "md",
  className,
}: {
  logo: ToolLogoId;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box = {
    sm: "size-7 rounded-[8px]",
    md: "size-10 rounded-[10px]",
    lg: "size-12 rounded-xl",
  }[size];
  const glyph = { sm: 16, md: 22, lg: 26 }[size];
  return (
    <span
      className={cn(
        "border-line text-ink grid shrink-0 place-items-center border bg-white shadow-[0_1px_2px_var(--shadow-color)] dark:border-transparent",
        box,
        className,
      )}
      style={{ color: BRAND_COLORS[logo] }}
    >
      <ToolLogo logo={logo} size={glyph} />
    </span>
  );
}
