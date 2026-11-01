import type { Metadata } from "next";

import {
  buildSectorMetadata,
  SectorPage,
} from "@/components/templates/sector-page";
import { type LocaleParams, resolvePageLocale } from "@/i18n/page-locale";
import { sectorPages } from "@/lib/sector-pages";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  return buildSectorMetadata(
    sectorPages.agencies,
    await resolvePageLocale(params),
  );
}

export default async function AgenciesUseCasePage({ params }: LocaleParams) {
  const locale = await resolvePageLocale(params);
  return <SectorPage config={sectorPages.agencies} locale={locale} />;
}
