import { Link } from "@/i18n/navigation";
import type { Offer } from "@/lib/offers";

export function OfferLedger({
  rows,
  labels,
  caption,
  trackLocation,
}: {
  rows: {
    id: string;
    name: string;
    href: Offer["page"];
    duration: string;
    price: string;
  }[];
  labels: { offer: string; duration: string; price: string };
  caption: string;
  trackLocation: string;
}) {
  return (
    <table
      className="w-full text-left"
      data-track-view="pricing_view"
      data-track-location={trackLocation}
    >
      <caption className="type-label text-text-3 caption-bottom pt-4 text-left">
        {caption}
      </caption>
      <thead className="max-sm:sr-only">
        <tr className="border-line type-label text-text-3 border-b">
          <th scope="col" className="py-3 pr-4 font-normal">
            {labels.offer}
          </th>
          <th scope="col" className="py-3 pr-4 font-normal">
            {labels.duration}
          </th>
          <th scope="col" className="py-3 text-right font-normal">
            {labels.price}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.id}
            className="border-line hover:bg-surface-1 border-b transition-colors duration-(--d-fast) max-sm:flex max-sm:flex-col max-sm:gap-1 max-sm:py-4"
          >
            <th scope="row" className="py-4 pr-4 font-medium max-sm:py-0">
              <Link
                href={row.href}
                className="hover:text-text-2 transition-colors"
              >
                {row.name}
              </Link>
            </th>
            <td className="type-data text-text-3 py-4 pr-4 max-sm:py-0">
              {row.duration}
            </td>
            <td className="type-data text-text py-4 text-right whitespace-nowrap max-sm:py-0 max-sm:text-left">
              {row.price}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
