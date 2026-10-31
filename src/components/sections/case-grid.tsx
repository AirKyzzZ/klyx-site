import type { CSSProperties } from "react";

import Image from "next/image";

import { ArrowRight } from "lucide-react";

import { ChamferBreak } from "@/components/chamfer-break";
import { BrowserFrame } from "@/components/proof/browser-frame";
import { Section, SectionHeading } from "@/components/section";
import { Link } from "@/i18n/navigation";
import type { CaseStudyMeta } from "@/lib/content";
import { getSiteShot } from "@/lib/proof";
import { cn } from "@/lib/utils";

type CaseCardLayout = "stack" | "wide";
type CaseDevice = "desktop" | "mobile";

const BAND_X = ["14%", "64%", "38%", "86%"];

function BandPicture() {
  return (
    <picture>
      <source type="image/avif" srcSet="/backdrop/band-1600.avif" />
      <source type="image/webp" srcSet="/backdrop/band-1600.webp" />
      <img
        src="/backdrop/band-1600.webp"
        alt=""
        width={1600}
        height={686}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

function CaseCover({
  item,
  bandX,
  sizes,
  device,
  className,
}: {
  item: CaseStudyMeta;
  bandX: string;
  sizes: string;
  device: CaseDevice;
  className?: string;
}) {
  const shot = getSiteShot(item.slug);
  const mobile = device === "mobile" && shot !== null;
  return (
    <div
      className={cn(
        "case-cover tone-dark border-line rounded-lg border",
        className,
      )}
      style={{ "--band-x": bandX } as CSSProperties}
    >
      <BandPicture />
      <div
        className={cn(
          "absolute top-[9%] transition-transform duration-(--d-ui) ease-(--ease-out) group-hover:-translate-y-1",
          mobile ? "inset-x-[27%]" : "inset-x-[7%]",
        )}
      >
        {shot ? (
          <BrowserFrame
            url={shot.url}
            image={mobile ? `/realisations/${item.slug}-390.png` : shot.image}
            alt={item.client}
            sizes={mobile ? "240px" : sizes}
            imageClassName={mobile ? "aspect-[390/844]" : undefined}
          />
        ) : (
          <div className="border-line-strong shadow-window relative aspect-[16/10] overflow-hidden rounded-lg border">
            <Image
              src={item.image}
              alt={item.client}
              fill
              sizes={sizes}
              className="object-cover object-top"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function CaseCard({
  item,
  readLabel,
  layout = "stack",
  bandX = BAND_X[0],
  sizes = "(min-width: 1024px) 560px, 90vw",
  device = "desktop",
  coverClassName,
}: {
  item: CaseStudyMeta;
  readLabel: string;
  layout?: CaseCardLayout;
  bandX?: string;
  sizes?: string;
  device?: CaseDevice;
  coverClassName?: string;
}) {
  const wide = layout === "wide";
  return (
    <Link
      href={{ pathname: "/realisations/[slug]", params: { slug: item.slug } }}
      className={cn(
        "group flex h-full flex-col gap-6",
        wide && "lg:grid lg:grid-cols-12 lg:items-end lg:gap-6",
      )}
    >
      <CaseCover
        item={item}
        bandX={bandX}
        sizes={sizes}
        device={device}
        className={cn(
          "aspect-[16/10]",
          wide && "lg:col-span-8 lg:aspect-[16/8]",
          coverClassName,
        )}
      />
      <div className={cn("flex flex-col", wide && "lg:col-span-4 lg:pb-2")}>
        <p className="type-label text-text-3">
          {[item.client, item.year, ...item.stack].join(" · ")}
        </p>
        <h3 className="type-h3 mt-3">{item.title}</h3>
        <p className="text-text-2 mt-2 max-w-[52ch] text-[0.9375rem] leading-normal">
          {item.summary}
        </p>
        <span className="text-text mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
          {readLabel}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

type CaseGridProps = {
  items: CaseStudyMeta[];
  readLabel: string;
  className?: string;
};

export function CaseGrid({ items, readLabel, className }: CaseGridProps) {
  return (
    <section className={cn("py-section", className)}>
      <ul className="container grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.slug}>
            <CaseCard
              item={item}
              readLabel={readLabel}
              bandX={BAND_X[i % BAND_X.length]}
              sizes="(min-width: 1024px) 340px, (min-width: 768px) 45vw, 90vw"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CaseBand({
  index,
  eyebrow,
  title,
  emphasis,
  subtitle,
  viewAllLabel,
  readLabel,
  items,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  emphasis?: string;
  subtitle: string;
  viewAllLabel: string;
  readLabel: string;
  items: CaseStudyMeta[];
}) {
  const [first, second, ...rest] = items;
  return (
    <>
      <ChamferBreak edge="top" />
      <Section tone="sand" index={index} eyebrow={eyebrow}>
        <div className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            lead={title}
            rest={emphasis}
            className="lg:col-span-7"
          />
          <div className="space-y-5 lg:col-span-4 lg:col-start-9">
            <p className="text-text-2 max-w-[44ch]">{subtitle}</p>
            <Link
              href="/realisations"
              className="group border-ink/20 text-text hover:bg-sand-200 inline-flex h-11 items-center gap-2 rounded-sm border px-4.5 text-[0.9375rem] font-medium transition-colors duration-(--d-fast)"
            >
              {viewAllLabel}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-(--d-fast) group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        <ul className="mt-12 grid gap-x-6 gap-y-14 md:mt-16 lg:grid-cols-12 lg:gap-y-16">
          {first && (
            <li className="reveal lg:col-span-7">
              <CaseCard
                item={first}
                readLabel={readLabel}
                bandX={BAND_X[0]}
                sizes="(min-width: 1024px) 600px, 90vw"
                coverClassName="lg:aspect-auto lg:h-[400px]"
              />
            </li>
          )}
          {second && (
            <li className="reveal lg:col-span-5">
              <CaseCard
                item={second}
                readLabel={readLabel}
                bandX={BAND_X[1]}
                device="mobile"
                sizes="(min-width: 1024px) 420px, 90vw"
                coverClassName="lg:aspect-auto lg:h-[400px]"
              />
            </li>
          )}
          {rest.map((item, i) => (
            <li key={item.slug} className="reveal lg:col-span-12">
              <CaseCard
                item={item}
                readLabel={readLabel}
                layout="wide"
                bandX={BAND_X[(i + 2) % BAND_X.length]}
                sizes="(min-width: 1024px) 680px, 90vw"
              />
            </li>
          ))}
        </ul>
      </Section>
      <ChamferBreak edge="bottom" />
    </>
  );
}
