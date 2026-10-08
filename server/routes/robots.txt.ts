/**
 * Served from the request origin so the sitemap URL always matches the host that is
 * actually crawled — a hardcoded domain breaks on preview deployments and staging.
 */
export default defineEventHandler((event) => {
  const origin = getRequestURL(event).origin

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-Agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
})
