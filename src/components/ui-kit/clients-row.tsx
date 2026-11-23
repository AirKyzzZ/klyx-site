import type { CSSProperties } from "react";

import { Link } from "@/i18n/navigation";
import type { ClientLogo } from "@/lib/home-sections";
import { cn } from "@/lib/utils";

import "./ui-kit.css";

export function ClientsRow({
  label,
  clients,
  className,
}: {
  label: string;
  clients: readonly ClientLogo[];
  className?: string;
}) {
  return (
    <div
      data-clients
      className={cn("flex flex-col items-center gap-[18px]", className)}
    >
      <p className="clients-label text-text-3 text-[0.8125rem]">{label}</p>
      <ul className="flex flex-wrap items-center justify-center gap-x-9 gap-y-4 md:gap-x-14">
        {clients.map((client, i) => (
          <li
            key={client.slug}
            className="client-logo flex"
            style={{ "--intro-i": i } as CSSProperties}
          >
            <Link
              href={{
                pathname: "/realisations/[slug]",
                params: { slug: client.slug },
              }}
              className="text-text-3 hover:text-text flex rounded-sm transition-colors duration-(--d-fast)"
            >
              <span
                aria-hidden="true"
                className="client-logo-mark"
                style={
                  {
                    "--logo": `url(${client.logo})`,
                    "--logo-h": `${client.height}px`,
                    aspectRatio: client.ratio,
                  } as CSSProperties
                }
              />
              <span className="sr-only">{client.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
