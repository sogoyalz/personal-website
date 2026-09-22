import { writeFile } from 'node:fs/promises'

const routes = ['/', '/about', '/skills', '/projects', '/journey', '/blog', '/contact']
const configuredUrl = process.env.SITE_URL || process.env.VITE_SITE_URL

if (!configuredUrl) {
  console.log('Skipping sitemap: set SITE_URL or VITE_SITE_URL for deployment builds.')
  process.exit(0)
}

const siteUrl = new URL(configuredUrl)
if (!['http:', 'https:'].includes(siteUrl.protocol)) {
  throw new Error('SITE_URL must be an http(s) URL.')
}

const origin = siteUrl.href.replace(/\/$/, '')
const entries = routes
  .map((route) => `  <url><loc>${origin}${route}</loc></url>`)
  .join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`

await writeFile(new URL('../public/sitemap.xml', import.meta.url), sitemap)
console.log(`Generated sitemap for ${origin}`)
