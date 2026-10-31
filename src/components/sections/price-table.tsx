import { Link } from "@/i18n/navigation";
import type { Offer } from "@/lib/offers";

type PriceRow = {
  href: Offer["page"];
  name: string;
  summary: string;
  duration: string;
  price: string;
};

type PriceTableProps = {
  headers: { offer: string; includes: string; duration: string; price: string };
  groups: { title: string; rows: PriceRow[] }[];
  vatNote: string;
};

export function PriceTable({ headers, groups, vatNote }: PriceTableProps) {
  return (
    <section className="pb-28 lg:pb-32">
      <div className="container max-w-5xl">
        <table className="w-full text-start">
          <caption className="text-muted-foreground caption-bottom pt-6 text-start text-sm">
            {vatNote}
          </caption>
          <thead className="max-md:sr-only">
            <tr className="text-muted-foreground text-sm">
              <th scope="col" className="py-3 pe-4 text-start font-medium">
                {headers.offer}
              </th>
              <th scope="col" className="py-3 pe-4 text-start font-medium">
                {headers.includes}
              </th>
              <th scope="col" className="py-3 pe-4 text-start font-medium">
                {headers.duration}
              </th>
              <th scope="col" className="py-3 text-end font-medium">
                {headers.price}
              </th>
            </tr>
          </thead>
          {groups.map((group) => (
            <tbody key={group.title}>
              <tr className="border-primary border-b-2">
                <th
                  scope="colgroup"
                  colSpan={4}
                  className="pt-10 pb-3 text-start text-lg font-semibold"
                >
                  {group.title}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr
                  key={row.name}
                  className="border-b max-md:flex max-md:flex-col max-md:gap-1 max-md:py-4"
                >
                  <th
                    scope="row"
                    className="py-4 pe-4 text-start align-top font-medium max-md:py-0"
                  >
                    <Link
                      href={row.href}
                      className="underline-offset-4 hover:underline"
                    >
                      {row.name}
                    </Link>
                  </th>
                  <td className="text-muted-foreground py-4 pe-4 align-top text-sm leading-snug max-md:py-0">
                    {row.summary}
                  </td>
                  <td className="text-muted-foreground py-4 pe-4 align-top font-mono text-xs max-md:py-0 md:whitespace-nowrap">
                    {row.duration}
                  </td>
                  <td className="py-4 text-end align-top font-mono text-sm whitespace-nowrap max-md:py-0 max-md:text-start">
                    {row.price}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </section>
  );
}
