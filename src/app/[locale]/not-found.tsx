import { getTranslations } from "next-intl/server";

import { Background } from "@/components/background";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <Background>
      <section className="container flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-36 pb-20 text-center">
        <p className="text-muted-foreground font-mono text-sm">404</p>
        <h1 className="text-4xl tracking-tight md:text-5xl">{t("title")}</h1>
        <p className="text-muted-foreground max-w-md">{t("body")}</p>
        <Button className="mt-4" size="lg" asChild>
          <Link href="/">{t("home")}</Link>
        </Button>
      </section>
    </Background>
  );
}
