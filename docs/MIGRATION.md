# Hosting migration plan: klyx.fr from OVH to a Next.js host

Written 2026-10-31. Pricing and docs checked the same day. Nothing in this document has been executed.

## Recommendation

Host on **Vercel Pro ($20/month, 1 seat)**.

Hobby is out: the Vercel terms (section 4) say the Hobby plan is only for "personal or non-commercial use", and klyx.fr is a business site. Pro is the cheapest compliant Vercel plan.

Why Vercel over the alternatives:

- Next.js 16 with Server Actions and `next/image` work with no adapter or workaround.
- `blog.klyx.fr`, `studio.klyx.fr` and `estate.klyx.fr` already CNAME to Vercel, so the tooling, domains and habits are the same.
- A `cdg1` (Paris) compute region exists. Functions default to `iad1` (Washington), so set the function region to `cdg1` in the project settings, otherwise Server Actions and dynamic routes run in the US. Static pages are served from the nearest PoP regardless.
- Web Analytics is built in (Pro: $3 per 100K events, inclusion not stated on the pricing page).

Cloudflare Workers is the credible cheaper option ($5/month paid plan, no bandwidth charges, static assets free) but it means running Next 16 through the OpenNext adapter with its own limits (Node middleware unsupported, 10 MiB Worker size cap on paid, image optimization through Cloudflare Images config). Worth it only if cost becomes a real constraint. If Vercel Pro is a problem later, this is the fallback.

### Comparison

| Criterion | Vercel Hobby | Vercel Pro | Cloudflare Workers (OpenNext) | Netlify |
|---|---|---|---|---|
| Cost/month | $0 | $20 per developer seat | $0 (100K req/day, 10 ms CPU) or $5 paid | $0 / $9 Personal / $20 Pro (credit based) |
| Commercial use | Forbidden by the terms | Allowed | Not restricted on the pricing page | Free plan wording not stated on the pricing page, check the ToS before use |
| FR latency | Global PoPs, `cdg1` region | Same, `cdg1` region selectable | Global network | Global CDN |
| Server Actions | Native | Native | Next 16 supported by the adapter, Server Actions not mentioned on the adapter page (the Workers guide says they work) | Supported via the Next runtime, not verified here |
| Image optimization | 5K transformations/month | $0.05 per 1K transformations, Pro inclusion not stated on the pricing page | Supported, configured through Cloudflare Images | Not listed on the pricing page |
| Analytics | 50K events | $3 per 100K events, Pro inclusion not stated on the pricing page | Separate product | Personal: 1 day, Pro: 30 days |
| Forms | None built in | None built in | None built in | Not mentioned on the pricing page |

Forms are not a differentiator: the contact form goes through a Server Action and Resend (`send.klyx.fr`), not a host feature.

Sources:

- https://vercel.com/pricing
- https://vercel.com/legal/terms (section 4, Hobby plan)
- https://vercel.com/docs/regions
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- https://opennext.js.org/cloudflare
- https://www.netlify.com/pricing/

Open question: which Vercel account owns the three existing subdomains. If it is a Hobby account, those sites carry the same commercial-use problem, and moving everything under one Pro team would fix both.

## DNS snapshot (dig, 2026-10-31)

Zone is hosted at OVH (`ns20.ovh.net`, `dns20.ovh.net`). The zone stays there.

| Name | Type | Value |
|---|---|---|
| `klyx.fr` | NS | `dns20.ovh.net.`, `ns20.ovh.net.` |
| `klyx.fr` | A | `188.165.53.185` (OVH hosting, TTL 3600) |
| `klyx.fr` | AAAA | `2001:41d0:301::21` (OVH hosting) |
| `klyx.fr` | MX | `10 mx.zoho.eu.`, `20 mx2.zoho.eu.`, `50 mx3.zoho.eu.` |
| `klyx.fr` | TXT | `v=spf1 include:zohomail.eu ~all` |
| `klyx.fr` | TXT | `brevo-code:e779b965f6dfa4705383d667b680d78d` |
| `klyx.fr` | TXT | `lemlist-verif=3e666b7d` |
| `klyx.fr` | TXT | `66a9581d1ef77ed45e3d5b4634ca64e2` (unknown owner, keep) |
| `_dmarc.klyx.fr` | TXT | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |
| `zmail._domainkey.klyx.fr` | TXT | Zoho DKIM (`v=DKIM1; k=rsa; p=MIGfMA0G...`) |
| `brevo1._domainkey.klyx.fr` | CNAME | `b1.klyx-fr.dkim.brevo.com.` |
| `brevo2._domainkey.klyx.fr` | CNAME | `b2.klyx-fr.dkim.brevo.com.` |
| `www.klyx.fr` | A / CNAME | no record |
| `blog.klyx.fr` | CNAME | `7ce82a2a6da03495.vercel-dns-017.com.` |
| `studio.klyx.fr` | CNAME | `cname.vercel-dns.com.` |
| `estate.klyx.fr` | CNAME | `cname.vercel-dns.com.` |

Re-run before the cutover, the state may have changed:

```sh
for t in NS A AAAA MX TXT; do dig +short $t klyx.fr; done
dig +short TXT _dmarc.klyx.fr
dig +short TXT zmail._domainkey.klyx.fr
dig +short CNAME brevo1._domainkey.klyx.fr
dig +short CNAME brevo2._domainkey.klyx.fr
dig +short A www.klyx.fr
```

## Do not touch

Mail for `contact@klyx.fr` lives on Zoho EU. Breaking any of these loses or spoofs mail.

- MX (all three Zoho EU records)
- SPF at the root (`include:zohomail.eu`). Do not add Resend to it, Resend sends from `send.klyx.fr` which has its own SPF.
- DKIM: `zmail._domainkey` (Zoho), `brevo1/brevo2._domainkey` (Brevo)
- DMARC at `_dmarc` (currently `p=none`, reports to Brevo). Tightening the policy is a separate task, after Resend alignment is confirmed.
- The Brevo, lemlist and unknown-hash TXT records
- `blog`, `studio`, `estate` CNAMEs. `blog.klyx.fr` stays as is and is not part of this migration.

The only root records that change are the `A` and `AAAA`.

## Resend records (add only)

Sending domain: `send.klyx.fr`. Add the domain in the Resend dashboard, which shows the exact names and values to paste. Do not guess them. Their shape, so you know what to expect:

| Name | Type | Purpose |
|---|---|---|
| `send` | MX (priority 10) | bounce/feedback handling, points at an Amazon SES feedback endpoint for the chosen region |
| `send` | TXT | SPF for the subdomain, `v=spf1 include:amazonses.com ~all` |
| `resend._domainkey` | TXT | DKIM public key (`p=...`) |
| `_dmarc` | TXT | optional in Resend's list; skip it, one already exists at the root and must not be replaced |

Notes:

- Records are on a subdomain, so they do not conflict with the root MX and SPF.
- The `resend._domainkey` name is under the root zone. It does not collide with `zmail` or `brevo*`.
- Do this step ahead of the site cutover, it is independent. Verify in the Resend dashboard, then send a test from the contact form.

## Cutover steps

T = cutover time.

1. **T minus 24 h or more:** lower the TTL of the root `A` and `AAAA` records from 3600 to 300 in the OVH DNS zone. Wait out the old TTL before moving on.
2. Deploy the new site on Vercel (Pro), set the function region to `cdg1`, confirm it works on the `*.vercel.app` URL. Set the env vars (Resend key, etc.).
3. Add `klyx.fr` and `www.klyx.fr` to the Vercel project. Vercel shows the exact records to use (apex `A`, `www` CNAME). Make `klyx.fr` the primary and `www` redirect to it.
4. Check the redirects from the old WordPress site are in the new one: `/agence-web-bordeaux/` to `/`, `/feed/`, `/category/non-classe/`, `/sitemap.xml`, `/wp-sitemap.xml`, `/sitemap_index.xml`, `/page-sitemap.xml`, and the lead magnet PDF `/wp-content/uploads/2025/07/guide_vitrine_essentiels.pdf` (keep the file reachable at that path or redirect it).
5. **At T, in the OVH DNS zone:**
   - add `www` as a CNAME to the value Vercel gives (there is no `www` record today)
   - change the root `A` from `188.165.53.185` to the apex value Vercel gives
   - **delete** the root `AAAA` (`2001:41d0:301::21`). Vercel's apex setup does not use an AAAA, and leaving the OVH one makes IPv6 visitors keep hitting the old server.
   - touch nothing else
6. **Verify:**
   ```sh
   dig +short A klyx.fr
   dig +short AAAA klyx.fr
   dig +short CNAME www.klyx.fr
   curl -sI https://klyx.fr | head -5
   curl -sI https://www.klyx.fr | head -5
   curl -sI https://klyx.fr/en | head -5
   curl -sI https://klyx.fr/agence-web-bordeaux/ | head -5
   ```
   Expect valid TLS (Vercel issues it once DNS resolves), `server: Vercel`, 301 on the old slug and on `www`.
7. **Mail check, the one that matters:** send a message from an external address to `contact@klyx.fr` and confirm it arrives in Zoho. Send one from Zoho to an external address and check the headers show SPF, DKIM and DMARC pass. Re-run the `dig` block from the snapshot and diff against the table above, only `A`, `AAAA` and `www` should differ.
8. Submit the new sitemap in Search Console and watch crawl errors for a week.
9. Once stable (a day or more), raise the TTL back to 3600.

## Rollback

Fast and safe because OVH hosting is kept alive:

1. In the OVH DNS zone, set the root `A` back to `188.165.53.185` and re-add the `AAAA` `2001:41d0:301::21`. Remove or leave `www` (it did not exist before; leave it pointing at Vercel or delete it).
2. Wait for the 300 s TTL, re-check with `dig` and `curl`.

Mail is unaffected in both directions, since MX and the TXT records are never changed. Keep the TTL at 300 until the 14-day window is over, so rollback stays fast.

## OVH cancellation

| Item | Action | When |
|---|---|---|
| Web hosting (WordPress, `188.165.53.185`) | Cancel | After 14 days of clean running on the new host: no rollback, no mail problems, Search Console clean. Export a final backup first (files and DB, plus the uploads folder). |
| Domain registration `klyx.fr` | Keep | Never cancel. Losing it loses the domain. |
| DNS zone (`ns20` / `dns20.ovh.net`) | Keep | The nameservers serve all records, including mail and the Vercel subdomains. Moving DNS is a separate decision, not part of this plan. |

If the OVH mail MX plan or any other OVH product is attached to the hosting offer, check before cancelling. Mail is Zoho, so it should not be, but confirm in the OVH manager.
