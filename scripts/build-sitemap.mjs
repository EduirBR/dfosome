// Static sitemap for SEO. Run `node scripts/build-sitemap.mjs` to regenerate
// after adding routes, then deploy public/sitemap.xml.
const base = 'https://dfolents.vercel.app'
const routes = ['/', '/rankings', '/items', '/skills', '/watchlist', '/about']

const urls = routes
  .map((route) => {
    const loc = route === '/' ? `${base}/` : `${base}${route}`
    return `  <url>\n    <loc>${loc}</loc>\n  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

import { writeFileSync } from 'node:fs'
writeFileSync('public/sitemap.xml', xml)
console.log('public/sitemap.xml written')
