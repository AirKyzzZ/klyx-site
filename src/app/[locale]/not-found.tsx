import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { NotFoundView } from "@/components/not-found-view";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const locale = await getLocale();

  return (
    <section data-shot="not-found" className="relative">
      <NotFoundView
        copy={{
          title: t("title"),
          body: t("body"),
          unknown: t("unknown"),
          suggested: t("suggested"),
        }}
        home={locale === "en" ? "/en" : "/"}
        actions={
          <>
            <Button size="lg" asChild>
              <Link href="/">{t("home")}</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/contact">
                {t("contact")}
                <ArrowRight />
              </Link>
            </Button>
          </>
        }
      />
    </section>
  );
}
