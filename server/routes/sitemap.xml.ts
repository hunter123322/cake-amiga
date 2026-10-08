import { CATEGORIES } from '~/data/shop/categories'
import { ALL_SEED_PRODUCTS } from '~/data/shop'

/**
 * Sitemap for the public shop. Admin edits live in the browser, so the sitemap is
 * generated from the shipped seed catalogue.
 */
/** A photo named `crown&fruit…` is enough to make the whole document unparseable, so escape every text value. */
function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler((event) => {
  const origin = getRequestURL(event).origin
  const now = new Date().toISOString().slice(0, 10)

  const staticPaths = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/menu', priority: '0.9', changefreq: 'weekly' },
    { path: '/cake-builder', priority: '0.9', changefreq: 'monthly' },
    { path: '/about', priority: '0.6', changefreq: 'yearly' },
    { path: '/contact', priority: '0.7', changefreq: 'yearly' },
  ]

  const categoryPaths = CATEGORIES.map((category) => ({
    path: `/${category.slug}`,
    priority: '0.9',
    changefreq: 'weekly',
  }))

  const productPaths = ALL_SEED_PRODUCTS.filter((product) => product.active).map((product) => ({
    path: `/${product.category}/${product.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
    image: product.images[0],
  }))

  const entries = [...staticPaths, ...categoryPaths, ...productPaths]

  const urls = entries
    .map((entry) => {
      const loc = xmlEscape(`${origin}${entry.path}`)
      const image = 'image' in entry && entry.image ? `\n    <image:image><image:loc>${xmlEscape(`${origin}${entry.image}`)}</image:loc></image:image>` : ''
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>${image}\n  </url>`
    })
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`
})
