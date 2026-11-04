# Portfolio candidates (discovery 2026-11-03)

Status is what the URL really serves on 2026-11-03, not just its HTTP code. Evidence comes from local repos, `gh`, and the old WordPress backup (`klyx-wordpress-backup-2026-11-01`, REST export, media and only the posts and Elementor rows of the SQL dump). Wayback answered 429 and has no snapshot of kenzievents.com. Shots are 1280x800 JPEG q55 from Playwright's bundled Chromium, in `docs/portfolio/candidates/`.

How the set was chosen: work built for someone else, with a live site, code by Maxime, or an old portfolio item that shows it. Own products and demos stay out.

## Added as case studies

| Name | Type | URL | Status | Evidence | Screenshot | Why relevant |
|---|---|---|---|---|---|---|
| Kenzi Events | Showcase site, events | no link (kenzievents.com) | 500 (Apache, PHP), also www | No repo. Logo on `public/realisations/kenzi.png`, shown and linked on the old klyx.fr home. Nothing proves what was built beyond "a website" | none, site down | Local client, named by Maxime. Maxime wrote "Kenzie", the logo says "Kenzi" |
| Créalogique | Showcase site, in development | no link. Staging crealogique.netlify.app, `noindex`. crealogique.fr is still the old IONOS site | Staging up | Private repo `AirKyzzZ/crealogique`, `feature/site-v1`, 25 commits by Maxime, 2026-10-23, Next 16. Home, 19 projects with filters, maquettes, atelier, à propos, contact (SMTP not verified), legal | `candidates/crealogique-staging.jpg` | Craft business, full redesign, named by Maxime |
| Lady Gallery | Student event site | lady-gallery.netlify.app | Live | `AirKyzzZ/lady-gallery`, 19 commits by Maxime, 2026-10-25, Astro, FR and EN | `candidates/lady-gallery.jpg` | Event site, closest match to the "Université Bordeaux Montaigne" request. "Montaigne" appears nowhere in his code; the site says Université de Bordeaux, Campus Victoire. Needs his confirmation |
| Reciproq | App website | no link (reciproq.com) | Parked: redirects to `/lander`, headless gets "Access Denied" | `gitlab.com/cochetantony/reciproq-offers`: AirKyzzZ 92, Antony Cochet 24, brandon.nalin 12, 2024-05 to 2025-06, Next 15. `screen_reciproq.png` on the old klyx.fr home. E5 portfolio: "développement frontend" | `candidates/reciproq.jpg` (denial page), cover from the WordPress media | Startup client, real product site |

## Old WordPress and repos, left out

| Name | Type | URL | Status | Why left out | Screenshot |
|---|---|---|---|---|---|
| ActionFocus | Sports photography site | actionfocus.netlify.app | Live | Looks like a demo: "Created for free using WordPress and Colibri", "12 rue du sport", a generic testimonial, contact domain does not resolve. No repo, no proof of a client | `candidates/actionfocus.jpg` |
| La Vie en Bleu | Events site | none found | Unknown | Only `lveb_screenshot.png` in the WordPress media and a name in his notes. No repo, no text on what was built. lavieenbleu.fr is an unrelated aquarium maker, lveb.fr is unrelated too | none |
| Cronolyss (ex-Chronolis) | Internal watch repair software | no public URL | Private | Added on 2026-11-04 at Maxime's request. Client not named, cover from the project docs with the user name removed. UI scope only: backend and project lead were others (123+14 commits by the lead, 33 by Maxime) | `public/realisations/cronolyss.png` |
| Tapage Culturel | Events collective site | none (`tapage.example.com` in config) | Not deployed | Code exists (`AirKyzzZ/TAPAGECULTUREL`, 5 commits, 2025-08-28), no sign it was delivered | none |
| Le Pavillon d'Arcachon | Rental site from a template | lepavillondarcachon.fr does not resolve | Down | 2020, README calls it his first website | none |
| Klyx Estate | Own studio site | estate.klyx.fr | Live | Own venture, already a sister site on `/a-propos` | `candidates/klyx-estate.jpg` |
| Cheatjob | Own SaaS | cheatjob.fr, redirects to cheatjob.com/fr | Live | Own product, not client work. Maxime's call whether it suits the agency | `candidates/cheatjob.jpg` |
| Maexis | Side project | maexis.vercel.app | Live | Own, with co-author Tyrdak | `candidates/maexis.jpg` |
| NullPost | School project (BTS E6) | nullpost.maximemansiet.fr | Live | Not client work | `candidates/nullpost.jpg` |
| French Tech Sender | Own outreach tool | french-tech-sender.vercel.app | Live | Not client work, forked base | `candidates/french-tech-sender.jpg` |
| Deezer Legends | Side project | deezer-legends.vercel.app | Live | Not client work | `candidates/deezer-legends.jpg` |
| face10ai | Side project, face rating | face10ai.vercel.app | Live | Not client work, wrong image for an agency | `candidates/face10ai.jpg` |
| EPSIWordle | School side project | epsiwordle.vercel.app | Live | Not client work | `candidates/epsiwordle.jpg` |

Already on the site: Hop Hop Immo, CiteMe, PKBA, VertiFlow.

Excluded: Verana and 2060.io employer work (forks, FIDES integrations, Hologram demos, concieragent), Linux Foundation repos in `Work/LF`, class work in `Work/Class`, personal tooling (dashboard-agency, obsidian vault, agents, bots, `TRESORIER-PKBA`), blog-klyx, klyx-wordpress, klyx-partner-site and his personal portfolios.
