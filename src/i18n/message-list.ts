type Values = Record<string, string | number>;

export type Translate = {
  (key: string, values?: Values): string;
  raw: (key: string) => unknown;
};

export function messageKeys(raw: unknown): string[] {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Expected a message object to list its keys");
  }
  return Object.keys(raw);
}

export function messageList<Field extends string>(
  t: Translate,
  path: string,
  fields: readonly Field[],
  values?: Values,
): Record<Field, string>[] {
  return messageKeys(t.raw(path)).map(
    (key) =>
      Object.fromEntries(
        fields.map((field) => [field, t(`${path}.${key}.${field}`, values)]),
      ) as Record<Field, string>,
  );
}

export function messageStrings(
  t: Translate,
  path: string,
  values?: Values,
): string[] {
  return messageKeys(t.raw(path)).map((key) => t(`${path}.${key}`, values));
}
