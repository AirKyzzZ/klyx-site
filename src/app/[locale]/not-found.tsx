import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { SampleWindow } from "@/components/sections/process-timeline";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section data-shot="not-found" className="relative">
      <div className="container flex min-h-[80vh] flex-col items-center justify-center pt-28 pb-24 text-center">
        <h1 className="type-h1">{t("title")}</h1>
        <p className="text-text-2 mt-4 max-w-[44ch]">{t("body")}</p>
        <div className="mt-10 w-full max-w-[560px] text-left">
          <SampleWindow file="klyx.fr">
            <p>
              <span className="text-accent">GET</span>{" "}
              <span className="text-text">/…</span>{" "}
              <span className="text-text-3" aria-hidden="true">
                →
              </span>{" "}
              <span className="text-ui-err">404</span>{" "}
              <span className="text-text-3">Not Found</span>
            </p>
          </SampleWindow>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/">{t("home")}</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/realisations">
              {t("cases")}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
