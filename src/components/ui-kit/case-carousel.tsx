"use client";

import { type CSSProperties, useEffect, useId, useRef, useState } from "react";

import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import "./ui-kit.css";

export type CarouselCase = {
  id: string;
  slug: string;
  stack: string;
  tab: string;
  client: string;
  title: string;
  need: string;
  built: string;
  result: string;
  image: string;
  alt: string;
};

export type CaseCarouselLabels = {
  tabs: string;
  need: string;
  built: string;
  result: string;
  read: string;
};

export function CaseCarousel({
  items,
  labels,
  interval = 4000,
  className,
}: {
  items: CarouselCase[];
  labels: CaseCarouselLabels;
  interval?: number;
  className?: string;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const paused = hovered || focused || !visible;
  const next = () => setActive((current) => (current + 1) % items.length);

  return (
    <div
      ref={root}
      data-case-carousel
      data-paused={paused ? "" : undefined}
      style={{ "--carousel-interval": `${interval}ms` } as CSSProperties}
      className={className}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
    >
      <div className="border-line bg-surface-1 grid overflow-hidden rounded-[20px] border [grid-template-areas:'stack']">
        {items.map((item, i) => (
          <div
            key={item.id}
            id={`${id}-panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${item.id}`}
            data-active={i === active ? "" : undefined}
            inert={i !== active}
            className={cn(
              "carousel-panel grid [grid-area:stack] lg:grid-cols-[452px_1fr]",
              i !== active && "invisible opacity-0",
            )}
          >
            <div className="flex flex-col gap-6 p-6 sm:p-10">
              <div className="flex flex-col gap-2">
                <p className="text-text-3 text-sm">{item.client}</p>
                <h3 className="text-text text-2xl leading-[1.15] font-semibold tracking-[-0.8px] sm:text-[1.75rem]">
                  {item.title}
                </h3>
              </div>
              <dl className="flex flex-col">
                {(
                  [
                    [labels.need, item.need],
                    [labels.built, item.built],
                    [labels.result, item.result],
                  ] as const
                ).map(([term, text]) => (
                  <div
                    key={term}
                    className="border-line flex flex-col gap-1 border-t py-3.5"
                  >
                    <dt className="text-text-3 text-[0.8125rem] font-medium">
                      {term}
                    </dt>
                    <dd className="text-text text-[0.9375rem] leading-normal">
                      {text}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto flex items-center justify-between gap-4">
                <Link
                  href={{
                    pathname: "/realisations/[slug]",
                    params: { slug: item.slug },
                  }}
                  className="text-text hover:text-accent text-[0.9375rem] font-medium underline decoration-1 underline-offset-[3px] transition-colors duration-(--d-fast)"
                >
                  {labels.read}
                </Link>
                <span className="text-text-3 text-[0.8125rem]">
                  {item.stack}
                </span>
              </div>
            </div>
            <div className="case-stage relative flex items-start justify-center overflow-hidden px-6 pt-10 pb-0 sm:px-10 lg:min-h-[480px] lg:justify-start lg:pt-[60px] lg:pl-[58px]">
              <div className="carousel-shot w-full max-w-[600px] overflow-hidden rounded-[10px] border border-white/25 shadow-[0_24px_48px_-8px_rgb(0_0_0/0.35)]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={1440}
                  height={900}
                  sizes="(min-width: 1024px) 600px, 90vw"
                  className="block h-auto w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        role="tablist"
        aria-label={labels.tabs}
        className="mt-6 grid grid-cols-3 gap-4 md:gap-6"
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            id={`${id}-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-panel-${item.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(event) => {
              const step =
                event.key === "ArrowRight"
                  ? 1
                  : event.key === "ArrowLeft"
                    ? -1
                    : 0;
              if (!step) return;
              event.preventDefault();
              const target = (i + step + items.length) % items.length;
              setActive(target);
              document.getElementById(`${id}-tab-${items[target].id}`)?.focus();
            }}
            className="text-text-3 hover:text-text aria-selected:text-text flex flex-col gap-3 text-left text-[0.8125rem] font-medium transition-colors duration-(--d-fast) sm:text-sm"
          >
            <span
              aria-hidden="true"
              className="bg-line-strong relative h-0.5 w-full overflow-hidden rounded-[1px]"
            >
              {i === active && (
                <span
                  key={active}
                  className="carousel-progress bg-accent absolute inset-0 origin-left"
                  onAnimationEnd={next}
                />
              )}
            </span>
            {item.tab}
          </button>
        ))}
      </div>
    </div>
  );
}
