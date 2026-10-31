import { Card, CardContent } from "@/components/ui/card";

type TestimonialsProps = {
  title: string;
  note?: string;
  items: { quote: string; author: string; company: string }[];
};

export function Testimonials({ title, note, items }: TestimonialsProps) {
  return (
    <section className="py-28 lg:py-32">
      <div className="container">
        <div className="space-y-4">
          <h2 className="text-3xl tracking-tight md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {note && (
            <p className="text-muted-foreground font-mono text-xs">{note}</p>
          )}
        </div>

        <ul className="mt-8 grid gap-5 md:mt-12 md:grid-cols-3 lg:mt-16">
          {items.map((item) => (
            <li key={item.author}>
              <Card className="bg-muted h-full border-none shadow-none">
                <CardContent className="flex h-full flex-col justify-between gap-10 p-6">
                  <blockquote className="font-display text-lg leading-snug font-medium md:text-xl">
                    {item.quote}
                  </blockquote>
                  <div className="space-y-0.5">
                    <div className="font-semibold">{item.author}</div>
                    <div className="text-muted-foreground text-sm">
                      {item.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
