# Analytics

Cookieless PostHog (EU Cloud). Off until `NEXT_PUBLIC_POSTHOG_KEY` is set: without it no PostHog code is downloaded and no request leaves the browser.

## How it loads

- `src/components/analytics/analytics-island.tsx` is mounted once in `src/app/[locale]/layout.tsx` (inside a `Suspense`, renders `null`). It sends `$pageview` on every pathname or search change and `pricing_view` on `/tarifs` and `/en/pricing`.
- After `load` and `requestIdleCallback`, it imports `analytics-runtime.ts` (about 1 KB gz). The runtime adds one delegated click listener and an `IntersectionObserver`, then, only if a key is set and neither Do Not Track nor Global Privacy Control is on, imports `posthog-js/dist/module.slim` (about 50 KB gz, no autocapture, replay or surveys code at all).
- `track()` in `src/lib/analytics/track.ts` queues events until PostHog is ready, then flushes. With no key it does nothing. Any client code can call it.

Config (`analytics-runtime.ts`): `persistence: "memory"`, `capture_pageview: false`, `autocapture: false`, `disable_session_recording: true`, heatmaps, dead clicks, rage clicks, exceptions, surveys, flags and external script loading all off, `mask_personal_data_properties: true`, `respect_dnt: true`. posthog-js marks the `ip` option as deprecated with no effect, so IP discarding is a project setting (see `docs/copy/TODO-maxime.md`).

Known limit of memory persistence: the anonymous id lives in the tab's memory. Client-side navigations keep it, a reload or a new tab starts a new one. A funnel therefore only links steps done in one tab without reload, which is the normal path here (Next `Link` navigation, Cal.com opens in a new tab after the click is recorded). If that undercounts, PostHog's `cookieless_mode: "always"` (server-side daily hash, must also be enabled in project settings) is the next step; it changes what the privacy page has to say, so decide it with the CNIL conditions in mind.

## Events

| Event | When | Properties |
|---|---|---|
| `$pageview` | every route change | PostHog defaults (`$current_url`, `$pathname`, referrer) |
| `cta_book_call_click` | any « Réserver un appel » / Cal.com button | `location` |
| `cta_quote_click` | any « Devis gratuit » button | `location` |
| `contact_submit` | Server Action result | `status`: `success` or `error`, never the form content |
| `pricing_view` | `/tarifs`, `/en/pricing`, or an offer price ledger / tier cards scrolled into view | `location`: `pricing_page`, `offer_page`, `sector_page` |

`location` values: `header`, `hero`, `final_cta`, `faq`, `offer_page`, `sector_page`, `contact_page`, `pour_page`, `page` (fallback).

### Tagging a new CTA

`ActionButton` and `CalBooking` already carry `data-track`. Pass `trackLocation` to name the slot; without it the location falls back to `pour_page` under `/pour/*`, else `page`. For any other element, add `data-track="<event>"` and optionally `data-track-location`. For a block whose view matters, add `data-track-view="<event>"`.

### Outreach pages (`/pour/*`)

`/pour` has its own root layout (`src/app/pour/layout.tsx` on `feature/outreach-landing-pages`). When it merges, mount the island there too:

```tsx
<Suspense fallback={null}>
  <AnalyticsIsland />
</Suspense>
```

Its `ActionButton` and `CalBooking` CTAs then report `location: "pour_page"` with no other change.

## Funnel: visit > CTA > contact

In PostHog (project « Klyx », EU): Product analytics > New insight > Funnels.

1. Step 1: `$pageview`. Optional filter: `$pathname` is not `/contact` and not `/en/contact`, to start from a content page.
2. Step 2: add both `cta_book_call_click` and `cta_quote_click` as one step (« Add step » then the step's « or » / action group), or create an Action « CTA click » matching both events and use it.
3. Step 3: `contact_submit` with filter `status = success`.
4. Aggregate by « Unique users », conversion window 1 hour (one tab session, see the limit above), step order « Sequential ».
5. Breakdown by event property `location` on step 2 to compare hero, header, final CTA, offer pages and `/pour`.
6. Save to a dashboard « Klyx funnel ». Add a Trends insight on `pricing_view` broken down by `location` and `$pathname` next to it.

Booked Cal.com calls happen on cal.com and are not tracked here. Compare `cta_book_call_click` with Cal.com's own booking count.

## Tests

- `src/lib/analytics/track.test.ts`: no-op without a key, queue then flush, switch-off.
- `e2e/analytics.spec.ts`: with no key, no request to `*.posthog.com`, no cookie except `NEXT_LOCALE`, empty local and session storage; CTA clicks, offer ledger view, client-side pricing navigation and `contact_submit` reach the tracker. The spec reads events through `window.__klyxEvents`, which `track()` fills only when a page defines it.
