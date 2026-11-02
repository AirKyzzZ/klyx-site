import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { OutreachPage } from "@/components/templates/outreach-page";
import { outreachMetadata, outreachPages } from "@/lib/outreach-pages";

export const metadata: Metadata = outreachMetadata(outreachPages.startups);

export default function StartupsSprintOutreachPage() {
  setRequestLocale("fr");
  return <OutreachPage config={outreachPages.startups} />;
}
