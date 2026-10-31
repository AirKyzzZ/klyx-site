import { ArrowUpRight } from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { Link } from "@/i18n/navigation";

type FounderProps = {
  title: string;
  body: string;
  experience: string;
  links: { label: string; href: string }[];
  aboutLabel: string;
};

export function Founder({
  title,
  body,
  experience,
  links,
  aboutLabel,
}: FounderProps) {
  return (
    <section className="py-20 lg:py-24">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-8 md:gap-16 lg:flex-row lg:items-center lg:gap-24">
          <div className="flex-[1.5]">
            <h2 className="text-3xl tracking-tight text-balance md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="text-muted-foreground mt-6 text-xl leading-snug md:text-2xl">
              {body}
            </p>
            <p className="text-muted-foreground mt-6 max-w-lg leading-relaxed">
              {experience}
            </p>
          </div>

          <div className="relative flex flex-1 flex-col justify-center gap-5 pt-10 lg:pt-0 lg:pl-10">
            <DashedLine
              orientation="vertical"
              className="absolute top-0 left-0 max-lg:hidden"
            />
            <DashedLine
              orientation="horizontal"
              className="absolute top-0 lg:hidden"
            />
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener"
                className="font-display flex items-center gap-2 text-2xl tracking-tight transition-opacity hover:opacity-70 md:text-3xl"
              >
                {link.label}
                <ArrowUpRight className="size-6" />
              </a>
            ))}
            <Link
              href="/a-propos"
              className="font-display flex items-center gap-2 text-2xl tracking-tight transition-opacity hover:opacity-70 md:text-3xl"
            >
              {aboutLabel}
              <ArrowUpRight className="size-6" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
