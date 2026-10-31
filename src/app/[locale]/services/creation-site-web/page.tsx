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
  return buildOfferMetadata(offerPages.sites, await resolvePageLocale(params));
}

export default async function SitesPage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  return <OfferPage config={offerPages.sites} locale={locale} />;
}
