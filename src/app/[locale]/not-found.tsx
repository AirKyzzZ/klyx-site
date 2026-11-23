import { getLocale } from "next-intl/server";

import { NotFoundView } from "@/components/not-found-view";
import type { Locale } from "@/i18n/routing";

export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  return <NotFoundView locale={locale} />;
}
