import type { Metadata } from "next";
import Image from "next/image";

import { CircleCheck, Mail, MapPin, Video, X } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";

import { CalBooking } from "@/components/cal-booking";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { FOUNDER_PHOTO } from "@/components/sections/founder-panel";
import { PageSection } from "@/components/ui-kit/page-section";
import { SectionHeader } from "@/components/ui-kit/section-header";
import { messageKeys } from "@/i18n/message-list";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { contactPageJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";
import { site, socialLinks } from "@/lib/site";

const SOCIAL_ICONS = {
  LinkedIn: FaLinkedin,
  GitHub: FaGithub,
  Instagram: FaInstagram,
} as const;

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.contact" });
  return buildMetadata({
    locale,
    pathname: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "contact" });
  const team = await getTranslations({ locale, namespace: "home.team" });
  const field = (key: string) => ({
    label: t(`form.fields.${key}.label`),
    placeholder: t(`form.fields.${key}.placeholder`),
  });
  const selectField = (key: string) => ({
    ...field(key),
    options: messageKeys(t.raw(`form.fields.${key}.options`)).map((value) => ({
      value,
      label: t(`form.fields.${key}.options.${value}`),
    })),
  });
  const perks = [
    { icon: Video, label: t("booking.video") },
    { icon: CircleCheck, label: t("booking.free") },
    { icon: X, label: t("booking.noCommitment") },
  ];
  const direct = [
    {
      icon: Mail,
      label: t("direct.email"),
      value: site.email,
      href: `mailto:${site.email}`,
    },
  ];

  return (
    <>
      <JsonLd data={contactPageJsonLd(locale)} />
      <PageSection
        id="hero"
        divider={false}
        containerClassName="pt-32 md:pt-40 lg:pt-44"
      >
        <SectionHeader
          as="h1"
          title={t("hero.title")}
          intro={t("hero.subtitle")}
        />
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-start">
          <div className="flex flex-col gap-6 lg:order-2">
            <section
              id="booking"
              aria-labelledby="booking-title"
              className="border-line bg-bg shadow-float overflow-hidden rounded-[20px] border"
            >
              <h2 id="booking-title" className="sr-only">
                {t("booking.title")}
              </h2>
              <div className="flex items-center gap-3.5 px-5 pt-[22px] pb-[18px] sm:px-6">
                <span className="relative shrink-0">
                  <Image
                    src={FOUNDER_PHOTO}
                    alt=""
                    width={104}
                    height={104}
                    sizes="52px"
                    className="size-13 rounded-full object-cover"
                  />
                  <span className="bg-ui-ok border-bg absolute right-0 bottom-0 size-4 rounded-full border-2" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-text text-base font-semibold">
                    {team("name")}
                  </p>
                  <p className="text-text-2 text-[0.8125rem]">
                    {t("booking.role")}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 sm:px-6">
                <p className="bg-surface-2 text-text rounded-[12px] rounded-tl-[4px] px-4 py-3 text-sm leading-normal">
                  {t("booking.message")}
                </p>
              </div>
              <div className="border-line flex flex-col gap-3 border-t px-5 py-5 sm:px-6">
                <CalBooking
                  calUrl={site.calUrl}
                  label={t("booking.title")}
                  title={t("booking.frame")}
                  trackLocation="contact_page"
                />
                <p className="text-text-3 text-center text-[0.8125rem]">
                  {t("booking.next")}
                </p>
              </div>
              <ul className="bg-surface-2 text-text-2 flex flex-wrap gap-x-[18px] gap-y-1.5 px-5 py-3.5 text-[0.8125rem] sm:px-6">
                {perks.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-1.5">
                    <Icon aria-hidden="true" className="size-3.5" />
                    {label}
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="direct-title"
              className="border-line bg-surface-1 rounded-[20px] border p-6 sm:p-8"
            >
              <h2
                id="direct-title"
                className="text-text text-lg leading-tight font-semibold tracking-[-0.3px]"
              >
                {t("direct.title")}
              </h2>
              <ul className="mt-5 flex flex-col gap-4">
                {direct.map(({ icon: Icon, label, value, href }) => (
                  <li key={href} className="flex items-center gap-3">
                    <span className="bg-accent-tint text-accent grid size-10 shrink-0 place-items-center rounded-[10px]">
                      <Icon
                        aria-hidden="true"
                        className="size-[18px]"
                        strokeWidth={1.75}
                      />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-text-3 text-[0.8125rem]">
                        {label}
                      </span>
                      <a
                        href={href}
                        className="text-text hover:text-accent-text truncate text-[0.9375rem] font-medium transition-colors duration-(--d-fast)"
                      >
                        {value}
                      </a>
                    </span>
                  </li>
                ))}
                <li className="flex items-center gap-3">
                  <span className="bg-surface-2 text-text-2 grid size-10 shrink-0 place-items-center rounded-[10px]">
                    <MapPin
                      aria-hidden="true"
                      className="size-[18px]"
                      strokeWidth={1.75}
                    />
                  </span>
                  <span className="text-text-2 text-[0.9375rem]">
                    {t("direct.location")}
                  </span>
                </li>
              </ul>
              <div className="border-line mt-6 flex items-center justify-between gap-4 border-t pt-5">
                <p className="text-text-3 text-[0.8125rem]">
                  {t("direct.socials")}
                </p>
                <ul className="flex gap-2">
                  {socialLinks.map(({ name, href }) => {
                    const Icon = SOCIAL_ICONS[name];
                    return (
                      <li key={name}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener"
                          aria-label={name}
                          className="border-line-strong text-text-2 hover:border-text-3 hover:text-text grid size-9 place-items-center rounded-full border transition-colors duration-(--d-fast)"
                        >
                          <Icon className="size-4" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          </div>

          <section
            id="contact-form"
            aria-labelledby="contact-form-title"
            className="border-line bg-surface-1 scroll-mt-28 rounded-[24px] border p-6 sm:p-10 lg:order-1"
          >
            <h2
              id="contact-form-title"
              className="text-text text-2xl leading-[1.15] font-semibold tracking-[-0.8px] sm:text-[1.75rem]"
            >
              {t("form.title")}
            </h2>
            <p className="text-text-2 mt-2 text-base leading-normal">
              {t("form.intro")}
            </p>
            <div className="mt-8">
              <ContactForm
                copy={{
                  name: field("name"),
                  email: field("email"),
                  company: field("company"),
                  need: selectField("need"),
                  budget: selectField("budget"),
                  message: field("message"),
                  honeypot: t("form.fields.honeypot.label"),
                  consent: t("form.consent"),
                  privacyLink: t("form.privacyLink"),
                  submit: t("form.submit"),
                  sending: t("form.sending"),
                  success: t("form.success"),
                }}
                locale={locale}
              />
            </div>
          </section>
        </div>
      </PageSection>
    </>
  );
}
