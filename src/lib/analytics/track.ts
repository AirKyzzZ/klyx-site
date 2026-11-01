export type EventProps = Record<string, string | number | boolean>;
export type AnalyticsClient = {
  capture: (event: string, props?: EventProps) => unknown;
};
type QueuedEvent = [event: string, props?: EventProps];

declare global {
  interface Window {
    __klyxEvents?: QueuedEvent[];
  }
}

const queue: QueuedEvent[] = [];
let client: AnalyticsClient | null | undefined;

export function track(event: string, props?: EventProps) {
  window.__klyxEvents?.push([event, props]);
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || client === null) return;
  if (client) client.capture(event, props);
  else queue.push([event, props]);
}

export function connectAnalytics(next: AnalyticsClient | null) {
  client = next;
  const pending = queue.splice(0);
  if (next) for (const [event, props] of pending) next.capture(event, props);
}
