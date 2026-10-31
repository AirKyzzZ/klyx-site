import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";

import { ActionButton } from "@/components/action-button";
import { Background } from "@/components/background";
import { ContactForm } from "@/components/contact-form";
import { DashedLine } from "@/components/dashed-line";
import { EmphasisTitle } from "@/components/emphasis-title";
import { messageKeys } from "@/i18n/message-list";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { site } from "@/lib/site";

const socials = [
  { name: "LinkedIn", href: site.socials.linkedinCompany, icon: FaLinkedin },
  { name: "GitHub", href: site.socials.github, icon: FaGithub },
  { name: "Instagram", href: site.socials.instagram, icon: FaInstagram },
];

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.contact" });
  return { title: { absolute: t("title") }, description: t("description") };
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
    <Background>
      <section className="pt-36 pb-28 lg:pt-48 lg:pb-32">
        <div className="container max-w-2xl">
          <h1 className="text-center text-4xl tracking-tight text-balance md:text-5xl">
            <EmphasisTitle
              title={t("hero.title")}
              emphasis={t("hero.titleEmphasis")}
            />
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-center leading-snug">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-3 md:mt-14 lg:mt-20">
            <div>
              <h2 className="font-medium">{t("booking.title")}</h2>
              <p className="text-muted-foreground mt-3 text-sm">
                {t("booking.body")}
              </p>
              <ActionButton action="book" size="sm" className="mt-4">
                {t("booking.title")}
              </ActionButton>
            </div>
            <div>
              <h2 className="font-medium">{t("direct.title")}</h2>
              <a
                href={`mailto:${site.email}`}
                className="text-muted-foreground hover:text-foreground mt-3 block text-sm"
              >
                {site.email}
              </a>
              <p className="text-muted-foreground mt-1 text-sm">
                {t("direct.location")}
              </p>
            </div>
            <div>
              <h2 className="font-medium">Klyx</h2>
              <div className="mt-3 flex gap-6">
                {socials.map(({ name, href, icon: Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener"
                    aria-label={name}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <DashedLine className="my-12" />

          <h2 className="mb-6 text-lg font-semibold">{t("form.title")}</h2>
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
              pending: t("form.pending"),
            }}
          />
        </div>
      </section>
    </Background>
  );
}
