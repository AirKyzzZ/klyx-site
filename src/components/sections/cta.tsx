import { SiteCta } from "@/components/ui-kit/site-cta";

type CtaAction = { action: "book" | "quote"; label: string };

type CtaProps = {
  title: string;
  emphasis?: string;
  body: string;
  primary: CtaAction;
  secondary: CtaAction;
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
