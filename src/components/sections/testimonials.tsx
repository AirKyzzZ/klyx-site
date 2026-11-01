import { Section, SectionHeading } from "@/components/section";
import { site } from "@/lib/site";

type TestimonialsProps = {
  index?: string;
  eyebrow?: string;
  title: string;
  emphasis?: string;
  items: { quote: string; author: string; company: string }[];
};

export function Testimonials({
  index,
  eyebrow,
  title,
  emphasis,
  items,
}: TestimonialsProps) {
  if (!site.flags.testimonialsConsented) return null;

  return (
    <Section index={index} eyebrow={eyebrow}>
      <SectionHeading lead={title} rest={emphasis} className="reveal" />
      <ul className="reveal mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
        {items.map((item) => (
          <li key={item.author}>
            <figure className="border-line bg-surface-1 shadow-card flex h-full flex-col justify-between gap-10 rounded-md border p-5 lg:p-7">
              <blockquote className="text-text text-[1.0625rem] leading-normal">
                {item.quote}
              </blockquote>
              <figcaption className="type-label text-text-3">
                <span className="text-text-2">{item.author}</span> ·{" "}
                {item.company}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
