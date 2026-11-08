# Pivot decisions log

Taken 2026-11-08 while Maxime is away. Each one can be reversed on this branch.

| # | Decision | Who | Why |
|---|---|---|---|
| 1 | Sites page H1 keeps « Création de site web à Bordeaux »; « La page qui vend ce que vos agents font » moves to the subtitle | Maxime | SEO first |
| 2 | Identity: direction A (current system, hero recentred on the engineer) plus B's work log as a section on home and `/forward-deployed-engineer` | Claude | Half a day, keeps last week's system, shows the FDE proof directly |
| 3 | Home hero opens on the FDE scenario, then Agents IA, then Sites | Claude | Matches the new headline |
| 4 | Work log stays an illustration with fictional names and the « Illustration » label | Claude | A real week needs Maxime to pick which client work can be shown |
| 5 | `#B83A00` used for orange text on light surfaces only; the brand orange stays for fills and dark surfaces | Claude | `#F54E00` text on sand is 3.07:1 and fails WCAG AA |
| 6 | Logo stays the current PNG mark, SVG trace parked | Claude | A trace needs Maxime's eye on the curves |
| 7 | Wording in `copy-fr.md` kept as written (home H1, nav group names, FDE expansion once per page) | Claude | Consistent with the positioning brief |
| 8 | Contact form untouched | Maxime | Resend key still missing |
| 9 | Sites H1 split as « Création de site web » + « à Bordeaux. », serif word « Bordeaux » (EN « Website design in Bordeaux. ») | Claude | Keeps the SEO phrase whole and the serif-in-h1 invariant |
| 10 | FDE hero scenario cut to five nodes (Ticket, Votre repo, Ingénieur + agent IA, Pull request, Mise en prod), review folded into the trace, engineer node at top centre under the « Votre équipe + Klyx » lane | Claude | Five nodes fit the graph with lane headers; node labels stay under the 14-character fit rule |
| 11 | Work log sits right after the home hero (section 01, before offers) and after the definition block on `/forward-deployed-engineer`; not mirrored in the machine view | Claude | It is the direct proof of the hero promise; it is an illustration, so the markdown view skips it |
| 12 | `#B83A00` lives as `--accent-on-light`; `.tone-sand` points `--accent-text` (`text-accent-text`) at it, every orange text class now uses that utility. Passes on `--sand-50` (5.03:1), not on `--sand-200` (4.23:1), so never orange text on `--sand-200` | Claude | No orange text sat on sand yet, this keeps it safe by default |
| 13 | « FDE » expanded on `/cas-usage/agences` only; the other use case pages never mention it | Claude | First mention rule from the positioning brief |
