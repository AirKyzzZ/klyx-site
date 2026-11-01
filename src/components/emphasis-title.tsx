type EmphasisTitleProps = {
  title: string;
  emphasis?: string;
  serif?: string;
};

function withSerif(text: string, word: string | undefined) {
  if (!word) return text;
  const start = text.indexOf(word);
  return (
    <>
      {text.slice(0, start)}
      <em className="font-serif text-[1.08em] font-normal tracking-[-0.01em]">
        {word}
      </em>
      {text.slice(start + word.length)}
    </>
  );
}

export function EmphasisTitle({ title, emphasis, serif }: EmphasisTitleProps) {
  const serifInEmphasis = serif ? emphasis?.includes(serif) : false;
  const serifInTitle = serif
    ? !serifInEmphasis && title.includes(serif)
    : false;
  if (serif && !serifInEmphasis && !serifInTitle) {
    throw new Error(
      `Serif word "${serif}" not found in heading "${title} ${emphasis ?? ""}"`,
    );
  }

  return (
    <>
      <span className="text-text">
        {withSerif(title, serifInTitle ? serif : undefined)}
      </span>
      {emphasis && (
        <>
          {" "}
          <span className="text-text-2">
            {withSerif(emphasis, serifInEmphasis ? serif : undefined)}
          </span>
        </>
      )}
    </>
  );
}
