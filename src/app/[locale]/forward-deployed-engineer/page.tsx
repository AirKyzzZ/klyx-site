import type { Metadata } from "next";

import {
  buildOfferMetadata,
  OfferPage,
} from "@/components/templates/offer-page";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { offerPages } from "@/lib/offer-pages";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  return buildOfferMetadata(offerPages.fde, await resolvePageLocale(params));
}

export default async function FdePage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  return <OfferPage config={offerPages.fde} locale={locale} />;
}
