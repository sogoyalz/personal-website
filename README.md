# Sourav Goyal — Personal Website

A scroll-driven 3D portfolio for Sourav Goyal: one continuous camera flight from a moon, through a spiral galaxy and a solar system where every planet is a project, past a constellation of milestones, into a rainy neon city with an SG signal on the clouds. Built with React, Vite and Three.js.

Live site: https://sogoyalz.github.io/personal-website/

## Local development

Use Node.js 22 or newer.

```bash
npm install
npm run dev
```

The site runs at `http://localhost:5173` by default.

## How it is put together

- `src/data/content.js` holds the facts: projects, timeline, socials, bio. Edit this first.
- `src/data/experience.js` decides how those facts appear in the film: which projects become planets and their colours, the journal lines, the constellation milestones, and the scroll positions the navigation jumps to.
- `src/experience/Experience.jsx` renders all text, navigation and the Quick view panel (a plain one-screen summary for visitors in a hurry, and the fallback when WebGL is unavailable).
- `src/experience/engine.js` is the 3D world: scene, camera path, colour-grading pass, and the timing of the text beats. It is loaded as a separate chunk after first paint.
- `src/experience/sound.js` generates the optional organ score with Web Audio; there are no audio files.
- `design/` keeps the standalone HTML prototypes the site was designed from.

Old routes (`/about`, `/projects`, `/journey`, …) redirect to the matching chapter of the single page. Visitors with "reduce motion" enabled get no rain, warp streaks or camera drift.

## Quality checks

```bash
npm run lint
npm test
npm run build
npm run check
```

`npm run check` is the same lint, content-test and production-build sequence used by GitHub Actions.

## Deployment and SEO

Pushes to `main` deploy automatically to GitHub Pages. Set the production origin for any other hosting target so canonical URLs and the sitemap use the deployed domain:

```bash
SITE_URL=https://example.com npm run build
```

You can also set `VITE_SITE_URL` in a local `.env` file using `.env.example` as a template. Configure the static host to rewrite unknown paths to `index.html` so direct visits to old routes redirect correctly.
