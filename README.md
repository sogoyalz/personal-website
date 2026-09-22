# Sourav Goyal — Personal Website

A React portfolio for Sourav Goyal, built with Vite, Tailwind CSS, Framer Motion, and React Router.

Live site: https://sogoyalz.github.io/personal-website/

## Local development

Use Node.js 22 or newer.

```bash
npm install
npm run dev
```

The site runs at `http://localhost:5173` by default. The current app routes are Home, About, Skills, Projects, Journey, Blog, and Contact. Poetry remains in the source for later work but is not linked or routed.

## Quality checks

```bash
npm run lint
npm test
npm run build
npm run check
```

`npm run check` is the same lint, content-test, and production-build sequence used by GitHub Actions. Content shared across pages lives in `src/data/content.js`; public GitHub metadata lives in `src/data/github.json`.

## Deployment and SEO

Pushes to `main` deploy automatically to GitHub Pages. Set the production origin for any other hosting target so canonical URLs and the sitemap use the deployed domain:

```bash
SITE_URL=https://example.com npm run build
```

You can also set `VITE_SITE_URL` in a local `.env` file using `.env.example` as a template. Configure the static host to rewrite unknown paths to `index.html` so direct visits to React routes work. Add the final résumé as `public/resume.pdf` before deployment; the navigation already links to that path.
