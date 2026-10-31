import { messageList, type Translate } from "@/i18n/message-list";

export const ROSTER_FIELDS = ["role", "who", "scope"] as const;

type RosterField = (typeof ROSTER_FIELDS)[number];

export type TeamRoster = {
  window: string;
  file: string;
  keys: Record<RosterField, string>;
  items: Record<RosterField, string>[];
};

export function teamRoster(t: Translate, path: string): TeamRoster {
  return {
    window: t(`${path}.window`),
    file: t(`${path}.file`),
    keys: {
      role: t(`${path}.keys.role`),
      who: t(`${path}.keys.who`),
      scope: t(`${path}.keys.scope`),
    },
    items: messageList(t, `${path}.items`, ROSTER_FIELDS),
  };
}
