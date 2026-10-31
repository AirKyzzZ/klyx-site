import { setRequestLocale } from "next-intl/server";

import { LanguageSwitcher } from "@/components/language-switcher";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      Klyx
      <LanguageSwitcher />
    </main>
  );
}
