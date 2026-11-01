import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { ActionButton } from "@/components/action-button";
import { AbstractBackdrop } from "@/components/backdrop/abstract-backdrop";
import { AgendaSlots } from "@/components/agenda-slots";
import { Section, SectionHeading } from "@/components/section";
import { SampleWindow } from "@/components/sections/process-timeline";
import type { Locale } from "@/i18n/routing";
import { HERO_BACKDROP } from "@/lib/hero-backdrop";

import type { HeroAction } from "./hero";

type CtaProps = {
  title: string;
  emphasis?: string;
  body: string;
  primary: HeroAction;
  secondary: HeroAction;
};

function Painting() {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet="/backdrop/bordeaux-800.avif 800w, /backdrop/bordeaux-1600.avif 1600w"
        sizes="(min-width: 1280px) 1168px, 100vw"
      />
      <source
        type="image/webp"
        srcSet="/backdrop/bordeaux-800.webp 800w, /backdrop/bordeaux-1600.webp 1600w"
        sizes="(min-width: 1280px) 1168px, 100vw"
      />
      <img
        src="/backdrop/bordeaux-800.webp"
        alt=""
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
        className="absolute inset-x-0 bottom-0 -z-2 h-[75%] w-full [mask-image:linear-gradient(180deg,transparent,#000_55%)] object-cover object-bottom opacity-70 brightness-125"
      />
    </picture>
  );
}

export async function Cta({
  title,
  emphasis,
  body,
  primary,
  secondary,
}: CtaProps) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "home.process" });
  const book = primary.action === "book" ? primary : secondary;
  const other = book === primary ? secondary : primary;
  return (
    <Section>
      <div className="reveal border-line-strong relative isolate overflow-hidden rounded-xl border bg-[linear-gradient(180deg,#1d1915_0%,#15130f_60%,#100f0d_100%)] shadow-[0_0_0_1px_var(--line),0_40px_160px_-40px_var(--glow)] after:absolute after:inset-0 after:-z-1 after:bg-[url(/textures/grain.png)] after:bg-size-[128px] after:mix-blend-overlay">
        {HERO_BACKDROP === "painting" ? (
          <Painting />
        ) : (
          <AbstractBackdrop variant={HERO_BACKDROP} />
        )}
        <div className="relative grid gap-10 px-5 py-12 sm:px-8 md:px-12 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-6">
          <div className="lg:col-span-6">
            <SectionHeading lead={title} rest={emphasis} />
            <p className="text-text-2 mt-5 max-w-[46ch]">{body}</p>
            <ActionButton
              action={other.action}
              variant="secondary"
              size="lg"
              className="bg-bg/40 mt-8 w-full sm:w-auto"
            >
              {other.label}
              <ArrowRight />
            </ActionButton>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <SampleWindow file={t("call.file")} sample={t("sample")}>
              <p className="text-text font-sans text-sm font-medium">
                {t("call.title")}
              </p>
              <p className="text-text-3 text-xs">{t("call.meta")}</p>
              <div className="mt-4">
                <AgendaSlots locale={locale} />
              </div>
              <ActionButton
                action={book.action}
                size="lg"
                className="mt-5 w-full font-sans"
              >
                {book.label}
              </ActionButton>
            </SampleWindow>
          </div>
        </div>
      </div>
    </Section>
  );
}
