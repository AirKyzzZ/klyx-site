import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";

import { CalBooking } from "@/components/cal-booking";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { Hero } from "@/components/sections/hero";
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

  return (
    <Hero
      title={t("hero.title")}
      emphasis={t("hero.titleEmphasis")}
      serif={t("hero.serif")}
      subtitle={t("hero.subtitle")}
      className="pb-24 md:pb-32"
    >
      <JsonLd data={contactPageJsonLd(locale)} />
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <section
          id="contact-form"
          aria-labelledby="contact-form-title"
          className="border-line bg-surface-1 shadow-card order-2 scroll-mt-28 rounded-md border p-5 sm:p-7 lg:order-1 lg:col-span-7 lg:p-8"
        >
          <h2 id="contact-form-title" className="type-h3">
            {t("form.title")}
          </h2>
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

        <aside className="order-1 space-y-6 lg:sticky lg:top-28 lg:order-2 lg:col-span-5">
          <section
            id="booking"
            aria-labelledby="booking-title"
            className="border-line-strong bg-surface-2 shadow-window rounded-lg border p-5 sm:p-7"
          >
            <p className="type-label text-text-3 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="bg-accent size-1.5 rounded-full"
              />
              {t("booking.duration")}
            </p>
            <h2 id="booking-title" className="type-h3 mt-4">
              {t("booking.title")}
            </h2>
            <p className="text-text-2 mt-2">{t("booking.body")}</p>
            <p className="type-data text-text-3 mt-4">{t("booking.next")}</p>
            <div className="mt-6">
              <CalBooking
                calUrl={site.calUrl}
                label={t("booking.title")}
                title={t("booking.frame")}
                trackLocation="contact_page"
              />
            </div>
          </section>

          <div className="border-line border-t pt-6">
            <p className="type-label text-text-3">{t("direct.title")}</p>
            <a
              href={`mailto:${site.email}`}
              className="type-data text-text hover:text-text-2 mt-2 inline-block underline underline-offset-4 transition-colors"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phoneE164}`}
              className="type-data text-text hover:text-text-2 mt-1 block w-fit underline underline-offset-4 transition-colors"
            >
              {site.phone}
            </a>
            <p className="type-data text-text-3 mt-1">{t("direct.location")}</p>
            <ul className="mt-5 flex gap-5">
              {socialLinks.map(({ name, href }) => {
                const Icon = SOCIAL_ICONS[name];
                return (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener"
                      aria-label={name}
                      className="text-text-3 hover:text-text transition-colors"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </Hero>
  );
}
