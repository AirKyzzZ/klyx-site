import Image from "next/image";

import { cn } from "@/lib/utils";

export function hostOf(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}

export function ShotFrame({
  image,
  alt,
  sizes,
  device = "desktop",
  eager = false,
  className,
}: {
  image: string;
  alt: string;
  sizes: string;
  device?: "desktop" | "mobile";
  eager?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-line bg-surface-2 shadow-panel relative overflow-hidden border",
        device === "mobile"
          ? "aspect-[390/844] rounded-[16px]"
          : "aspect-[16/10] rounded-[10px]",
        className,
      )}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : undefined}
        className="object-cover object-top"
      />
    </div>
  );
}
