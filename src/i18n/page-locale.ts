import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { type Locale, routing } from "./routing";

export type LocaleParams = { params: Promise<{ locale: string }> };

export async function resolvePageLocale(
  params: LocaleParams["params"],
): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}
