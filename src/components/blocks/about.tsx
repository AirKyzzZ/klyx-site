import Link from "next/link";

import { ImagePlaceholder } from "@/components/image-placeholder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const About = () => {
  return (
    <section className="container mt-10 flex max-w-5xl flex-col-reverse gap-8 md:mt-14 md:gap-14 lg:mt-20 lg:flex-row lg:items-end">
      <div className="flex flex-col gap-8 lg:gap-16 xl:gap-20">
        <ImageSection count={2} className="xl:-translate-x-10" />

        <TextSection
          title="The team"
          paragraphs={[
            "We started building Mainline in 2019 and launched in 2022. Every endpoint has been designed from the ground up — with no technical debt or legacy systems. We are purpose-built to power project management innovation for the next hundred years.",
            "We are 100% founder and team-owned, profitable, and we keep our team lean. Over time, this page will become more polished, but for now, we're focused on delivering for developers.",
            "If you're interested in building the future of PM, check out our open roles below.",
          ]}
          ctaButton={{
            href: "#",
            text: "View open roles",
          }}
        />
      </div>

      <div className="flex flex-col gap-8 lg:gap-16 xl:gap-20">
        <TextSection
          paragraphs={[
            "At Mainline, we are dedicated to transforming the way teams plan, execute, and deliver projects. Our mission is to provide our customers with an unbeatable edge over delays, inefficiencies, and disorganisation through actionable insights and seamless collaboration. We'll stop at nothing to give you the tools you need to get every project across the finish line.",
            "We're customer-obsessed — investing the time to understand every aspect of your workflow so that we can help you operate better than ever before. We're all in this together because your success is our success. In our history as a company, we've never lost a customer, because when your projects succeed, so do we.",
          ]}
        />
        <ImageSection count={2} className="hidden lg:flex xl:translate-x-10" />
      </div>
    </section>
  );
};

const ImageSection = ({
  count,
  className,
}: {
  count: number;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {Array.from({ length: count }, (_, index) => (
        <ImagePlaceholder
          key={index}
          className="aspect-[2/1.5] overflow-hidden rounded-2xl"
        />
      ))}
    </div>
  );
};

type TextSectionProps = {
  title?: string;
  paragraphs: string[];
  ctaButton?: {
    href: string;
    text: string;
  };
};

const TextSection = ({ title, paragraphs, ctaButton }: TextSectionProps) => {
  return (
    <section className="flex-1 space-y-4 text-lg md:space-y-6">
      {title && <h2 className="text-foreground text-4xl">{title}</h2>}
      <div className="text-muted-foreground max-w-xl space-y-6">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {ctaButton && (
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href={ctaButton.href}>{ctaButton.text}</Link>
          </Button>
        </div>
      )}
    </section>
  );
};
