# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running locally

No build step. Serve from the repo root over HTTP (required because `app.js` uses `fetch('data/projects.json')`):

```bash
python3 -m http.server 8080
# or
npx serve .
```

Open `http://localhost:8080`.

## Architecture

Vanilla JS SPA with no framework and no bundler.

| File | Role |
|------|------|
| `index.html` | Entry point. Mounts `<aside id="sidebar">` and `<main id="app">`. Loads scripts in order: `i18n.js` then `app.js`. |
| `js/i18n.js` | Translation strings (CA/EN/ES) + `t(key)`, `setLang(lang)`, `getLang()`. Language persisted in `localStorage`. |
| `js/app.js` | All rendering and routing logic. Functions: `renderSidebar()`, `renderHome()`, `renderProject(id)`, `renderAbout()`, `navigate()`, `switchLang()`, `render()`. |
| `data/projects.json` | Project data. Loaded once on init via `fetch`. Schema: `id`, `name`, `tile_name`, `year`, `section` (`main`|`altres`), `cover`, `images[]`, `description.{ca,en,es}`, optional `image_cols`. |
| `styles.css` | All styles. |
| `DESIGN.md` | Full design system reference (Stripe-inspired). Authoritative spec for colors, typography, shadows, spacing. Consult before any UI change. |
| `Projects/` | Raw image/video assets referenced by path in `projects.json`. Not served from a CDN; paths are URL-encoded by `imgSrc()` in `app.js`. |

## Routing

Hash-based. Three routes:
- `#/` — bento grid home
- `#/about` — about page with video + portrait
- `#/project/:id` — project detail with image gallery and lightbox

`render()` reads `location.hash` and calls the appropriate render function. `navigate()` calls `history.pushState` then `render()`.

## Adding or editing a project

Edit `data/projects.json`. The `id` must be URL-safe (used in the hash). Image paths in `cover` and `images[]` are relative to `Projects/` and may contain spaces/special characters — `imgSrc()` handles encoding.

## Design system

See `DESIGN.md` for the full Stripe-inspired spec. Key rules:
- Font: Inter (loaded from Google Fonts) — not `sohne-var`, which the design doc describes as the aspirational target.
- Heading color: `#061b31` (deep navy), not black.
- Primary accent: `#533afd` (Stripe purple).
- Shadows use blue-tinted `rgba(50,50,93,0.25)` as the primary layer.
- Border-radius: 4–8px only.

## Internationalization

All user-facing strings go through `t(key)`. To add a string: add the key to all three locale objects in `js/i18n.js`, then call `t('your_key')` in the render function. Project descriptions are stored directly in `projects.json` under `description.{ca,en,es}` and accessed without `t()`.
