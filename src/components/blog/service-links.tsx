import { OfferLink } from "@/components/ui-kit/offer-link";

export function ServiceLinks({
  title,
  items,
  className,
}: {
  title: string;
  items: { key: string; name: string; price: string; href: string }[];
  className?: string;
}) {
  return (
    <section aria-labelledby="services-title" className={className}>
      <h2
        id="services-title"
        className="text-text text-lg font-semibold tracking-[-0.3px]"
      >
        {title}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map(({ key, ...item }) => (
          <li key={key}>
            <OfferLink {...item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
