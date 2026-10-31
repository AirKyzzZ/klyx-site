type EmphasisTitleProps = {
  title: string;
  emphasis?: string;
};

export function EmphasisTitle({ title, emphasis }: EmphasisTitleProps) {
  if (!emphasis) return title;
  return (
    <>
      {title}{" "}
      <em className="font-serif text-[1.08em] font-normal tracking-normal">
        {emphasis}
      </em>
    </>
  );
}
