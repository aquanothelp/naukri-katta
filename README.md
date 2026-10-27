# Naukri Katta — prototype

A free, static recruitment-news site (jobs, results, admit cards, answer keys) for GitHub Pages.
It uses plain HTML, CSS and JS with no build step. All content comes from `data/jobs.json`.

> **All notices in `data/jobs.json` are fictional sample data.** Replace them before showing the site publicly.

## Features
- Live search (English + Marathi), category chips, district, qualification and sort filters, plus an "open only" toggle
- Deadline badges (days left, last day, closed) and a "NEW" tag for items under 2 days old
- Detail page: key facts, important dates, how-to-apply steps, a countdown, similar notices
- Save/bookmark (stored in the browser), share (native share sheet or copy link), WhatsApp share, calendar reminder (.ics with a 2-day alert)
- Marathi/English toggle, dark mode, mobile-first layout, keyboard shortcut `/` for search

## Run locally
```
python -m http.server 5173 --directory prototype
```
Open http://localhost:5173. Opening `index.html` straight from disk won't work, because the browser blocks `fetch` for local files.

## Publish on GitHub Pages (free)
1. Create a new **public** GitHub repo, e.g. `naukri-katta`.
2. Push the **contents of this `prototype/` folder** to the repo root (not the whole NMK folder, which holds internal notes).
3. In the repo, go to **Settings → Pages → Source: GitHub Actions**.
4. Push to `main`. The workflow in `.github/workflows/pages.yml` validates the JSON and deploys.
5. The site goes live at `https://<your-user>.github.io/naukri-katta/`.

## Add or edit a notice
Edit `data/jobs.json` in the GitHub web editor and commit; the site redeploys in about a minute.
Fields: `id` (unique, used in the URL), `type` (`job` | `result` | `admit` | `answerkey`), `category`,
`title`/`org`/`summary`/`age`/`fee` as `{ "en": "...", "mr": "..." }`, `district`, `qualification` (list),
`posts`, dates as `YYYY-MM-DD` (`published`, `startDate`, `lastDate`, `examDate`), `salary`, `steps` (list of `{en, mr}`).
New categories need a label in `app.js` (`cats`, `CAT_ICON`, `CAT_COLOR`).
