import { SiteCta } from "@/components/ui-kit/site-cta";

import type { HeroAction } from "./hero";

type CtaProps = {
  title: string;
  emphasis?: string;
  body: string;
  primary: HeroAction;
  secondary: HeroAction;
};

export async function Cta({
  title,
  emphasis,
  body,
  primary,
  secondary,
}: CtaProps) {
  const quote = primary.action === "quote" ? primary : secondary;
  return (
    <SiteCta
      title={emphasis ? `${title} ${emphasis}` : title}
      body={body}
      secondaryLabel={quote.action === "quote" ? quote.label : undefined}
    />
  );
}
