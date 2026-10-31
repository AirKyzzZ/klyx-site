import { type AbstractIntlMessages, createTranslator } from "next-intl";

import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

import type { Translate } from "./message-list";
import type { Locale } from "./routing";

const messages: Record<Locale, AbstractIntlMessages> = { fr, en };

export function getStaticTranslator(locale: Locale, namespace: string) {
  return createTranslator({
    locale,
    messages: messages[locale],
    namespace,
  }) as unknown as Translate;
}
