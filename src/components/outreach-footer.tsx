import { getTranslations } from "next-intl/server";

import { Hr } from "@/components/section";
import { Link } from "@/i18n/navigation";
import { OUTREACH_PROOF_LINE } from "@/lib/outreach-pages";

const footerLink = "hover:text-text transition-colors duration-(--d-fast)";

export async function OutreachFooter() {
  const footer = await getTranslations({ locale: "fr", namespace: "footer" });
  const privacy = await getTranslations({
    locale: "fr",
    namespace: "privacy.prospection",
  });

  return (
    <footer className="bg-bg-sunken relative z-1">
      <Hr />
      <div className="container">
        <div className="text-text-3 flex flex-col gap-3 py-6 font-mono text-xs md:flex-row md:items-center md:justify-between">
          <p className="tabular-nums">{OUTREACH_PROOF_LINE}</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <Link href="/mentions-legales" className={footerLink}>
                {footer("legal")}
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className={footerLink}>
                {footer("privacy")}
              </Link>
            </li>
            <li>
              <Link
                href={{ pathname: "/confidentialite", hash: privacy("anchor") }}
                className={footerLink}
              >
                {privacy("title")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
