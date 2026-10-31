import type { Metadata } from "next";

import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { Statement } from "@/components/sections/statement";
import { Button } from "@/components/ui/button";
import { messageList } from "@/i18n/message-list";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return { title: { absolute: t("title") }, description: t("description") };
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  const t = await getTranslations({ locale, namespace: "about" });
  const facts = messageList(t, "facts.items", ["label", "value"], {
    siret: site.siret,
  });
  const sisterText = {
    "Klyx Studio": t("lines.studio"),
    "Klyx Estate": t("lines.estate"),
  };

  return (
    <>
      <Background>
        <Hero
          title={t("hero.title")}
          emphasis={t("hero.titleEmphasis")}
          subtitle={t("hero.subtitle")}
          aside={
            <div className="space-y-5">
              <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                {t("facts.title")}
              </h2>
              <dl className="space-y-4">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-muted-foreground text-sm">
                      {fact.label}
                    </dt>
                    <dd className="font-display text-lg tracking-tight md:text-xl">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          }
        />
      </Background>

      <Statement
        rows={[
          {
            title: t("story.title"),
            paragraphs: [t("story.intro"), t("story.work"), t("story.citeme")],
            children: (
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="outline" className="shadow-md" asChild>
                  <a href={site.socials.github} target="_blank" rel="noopener">
                    {t("links.github")} <ArrowUpRight className="size-4" />
                  </a>
                </Button>
                <Button variant="outline" className="shadow-md" asChild>
                  <a
                    href={site.socials.linkedinFounder}
                    target="_blank"
                    rel="noopener"
                  >
                    {t("links.linkedin")} <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              </div>
            ),
          },
          { title: t("trust.title"), paragraphs: [t("trust.body")] },
          {
            title: t("lines.title"),
            children: (
              <ul className="space-y-4">
                {site.sisterSites.map((sister) => (
                  <li
                    key={sister.url}
                    className="text-muted-foreground leading-relaxed"
                  >
                    {sisterText[sister.name]}{" "}
                    <a
                      href={sister.url}
                      target="_blank"
                      rel="noopener"
                      className="text-foreground inline-flex items-center gap-0.5 font-medium underline-offset-4 hover:underline"
                    >
                      {new URL(sister.url).host}
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            ),
          },
        ]}
      />

      <Background variant="bottom">
        <Cta
          title={t("cta.title")}
          body={t("cta.body")}
          primary={{ action: "book", label: t("cta.ctaPrimary") }}
          secondary={{ action: "quote", label: t("cta.ctaSecondary") }}
        />
      </Background>
    </>
  );
}
