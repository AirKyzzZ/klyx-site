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

export const BAND_X = ["14%", "64%", "38%", "86%"];

export function BandPicture() {
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
  const lift =
    "absolute top-[9%] transition-transform duration-(--d-ui) ease-(--ease-out) group-hover:-translate-y-1";
  return (
    <div
      className={cn(
        "case-cover tone-dark border-line rounded-lg border",
        className,
      )}
      style={{ "--band-x": bandX } as CSSProperties}
    >
      <BandPicture />
      <div className={cn(lift, "inset-x-[7%]", mobile && "lg:hidden")}>
        {shot ? (
          <BrowserFrame
            url={shot.url}
            image={shot.image}
            alt={item.client}
            sizes={sizes}
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
      {mobile && (
        <div className={cn(lift, "inset-x-[27%] hidden lg:block")}>
          <BrowserFrame
            url={shot.url}
            image={`/realisations/${item.slug}-390.png`}
            alt={item.client}
            sizes="240px"
            imageClassName="aspect-[390/844]"
            compact
          />
        </div>
      )}
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

type CaseSpan = "wide" | "7" | "5";

function caseSpan(index: number, total: number): CaseSpan {
  if (index === total - 1 && total % 2 === 1) return "wide";
  const row = Math.floor(index / 2);
  const first = index % 2 === 0;
  return (row % 2 === 0) === first ? "7" : "5";
}

export function CaseList({
  items,
  readLabel,
  className,
}: {
  items: CaseStudyMeta[];
  readLabel: string;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid gap-x-6 gap-y-14 lg:grid-cols-12 lg:gap-y-20",
        className,
      )}
    >
      {items.map((item, i) => {
        const span = caseSpan(i, items.length);
        return (
          <li
            key={item.slug}
            className={cn(
              "reveal",
              span === "wide" && "lg:col-span-12",
              span === "7" && "lg:col-span-7",
              span === "5" && "lg:col-span-5",
            )}
          >
            <CaseCard
              item={item}
              readLabel={readLabel}
              layout={span === "wide" ? "wide" : "stack"}
              device={span === "5" ? "mobile" : "desktop"}
              bandX={BAND_X[i % BAND_X.length]}
              sizes={
                span === "5"
                  ? "(min-width: 1024px) 420px, 90vw"
                  : "(min-width: 1024px) 680px, 90vw"
              }
              coverClassName={
                span === "wide" ? undefined : "lg:aspect-auto lg:h-[400px]"
              }
            />
          </li>
        );
      })}
    </ul>
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

        <CaseList
          items={items}
          readLabel={readLabel}
          className="mt-12 md:mt-16"
        />
      </Section>
      <ChamferBreak edge="bottom" />
    </>
  );
}
