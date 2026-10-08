# SEO VALIDATION and REFACTOR

**Version:** 1.0
**Scope:** Nuxt.js codebase (SSR / hybrid rendering), pre-deploy CI validation
**Audience:** AI validation agents, developers performing SEO refactors
**Status:** Frozen specification — treat as source of truth. Do not add arbitrary thresholds.

---

## 0. Purpose

This document defines how an AI agent should **validate** and **refactor** a Nuxt.js codebase against deterministic SEO requirements.

The agent's job is **not** to produce an SEO score. Its job is to:

1. Determine whether an important, indexable URL can be **discovered, crawled, and indexed** as the intended canonical URL/content.
2. Flag SEO/quality issues that do not block indexation.
3. Suggest or apply refactors that fix real problems without introducing arbitrary SEO-tool conventions.

**Guiding rule:**

> Never fail a build because of an arbitrary SEO-tool threshold unless it corresponds to an actual Google requirement or a clearly defined project requirement.

---

## 1. Severity Model

Use exactly three severities. Do not add `BLOCKER`, `ERROR`, or `FATAL`.

| Severity | Definition | Build behavior |
|---|---|---|
| **CRITICAL** | A deterministic implementation failure that prevents, or materially risks preventing, an important indexable URL from being discovered, crawled, or indexed as the intended canonical URL/content. | Build fails |
| **WARNING** | The page remains crawlable and indexable, but has an SEO, performance, accessibility, metadata, or content-quality issue. | Build succeeds, issue reported |
| **INFO** | Optional enhancement or implementation best practice. | Build succeeds, informational only |

### 1.1 CRITICAL — allowed cases only

```text
CRITICAL is limited to:
- important URL returns 4xx/5xx
- important URL has unintended noindex (meta or HTTP header)
- robots.txt blocks an important URL
- redirect loop
- redirect never reaches intended destination
- important URL redirects to the wrong page
- canonical points to an unintended or non-indexable URL
- multiple conflicting canonicals on an important page
- important indexable content is absent from the rendered DOM
- critical crawl path is broken (important pages unreachable via internal links)
- sitemap XML is malformed AND the failure materially prevents discovery of important URLs
- SSR is disabled globally (ssr: false) in a production build
```

Anything not in this list is **not CRITICAL**, regardless of how bad it looks.

### 1.2 WARNING — representative cases

```text
- long title
- missing or weak meta description
- missing <html lang>
- heading hierarchy problem
- multiple H1s
- missing meaningful alt on a meaningful image
- missing image width/height or aspect ratio
- missing Open Graph / Twitter metadata
- redirect chain (multi-hop, non-looping)
- sitemap URL is non-canonical or redirects
- sitemap not referenced from robots.txt
- incomplete or optional structured data
- font-display not set
- client-only rendering of secondary content
```

### 1.3 INFO — representative cases

```text
- favicon
- web app manifest
- descriptive image filenames
- optional schema properties
- security attributes on external links (noopener)
- social preview image dimensions
```

---

## 2. Validation Pipeline

The agent MUST run all three layers. A check that appears in one layer does not replace the others.

```text
                 Production Build
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
     Layer 1        Layer 2        Layer 3
   AST / Static     HTTP          Playwright
     Analysis     Validation    Rendered DOM
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                 SEO Validator
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
          CRITICAL   WARNING     INFO
             │
        Build failure
```

### Layer 1 — Static AST / template analysis

**Purpose:** Catch deterministic implementation issues in source files before the build runs.

**Inputs:** `.vue`, `.ts`, `.js`, `nuxt.config.ts`, `app.vue`, `app.config.ts`, composables, plugins, server routes.

**Tools:** `vue-tsc`, `@vue/compiler-sfc`, custom AST walker, `eslint-plugin-vue`, `eslint-plugin-nuxt`.

**What it can and cannot do:**

| Can detect | Cannot detect |
|---|---|
| Missing `alt` attribute on `<img>` / `<NuxtImg>` | Whether the rendered title is correct |
| Missing `width`/`height` on images | Actual LCP/CLS values |
| `loading="lazy"` on above-fold candidates | Whether Google can index the page |
| Duplicate `useSeoMeta` calls in one component | Rendered canonical URL |
| `onMounted`-only SEO metadata (client-only) | Redirect behavior |
| `ssr: false` in `nuxt.config.ts` | Rendered structured data |
| `<ClientOnly>` wrapping critical content | Sitemap validity |
| Hardcoded `localhost` in canonical | robots.txt contents |

**Important:** Static analysis is **supplemental**. Do not fail a page based solely on source-file grep. A `.vue` file may not literally contain `<title>` while SSR correctly emits it. **The rendered output is the source of truth.**

### Layer 2 — HTTP validation

**Purpose:** Validate crawl-level behavior that never appears in the DOM.

**Inputs:** The local production build server (e.g., `node .output/server/index.mjs` or `nuxi preview`), plus any HTML routes served by the external Bun backend.

**Checks:**

```bash
curl -sS -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/
curl -sS http://localhost:3000/robots.txt
curl -sS http://localhost:3000/sitemap.xml
curl -sSI http://localhost:3000/some-important-page
curl -sSI http://localhost:3000/old-page-should-redirect
```

Validate:

- HTTP status codes (200 for important pages, 301/308 for intentional redirects)
- Redirect targets and hop counts
- `robots.txt` presence, syntax, and absence of `Disallow: /`
- `sitemap.xml` presence, parseability, and URL validity
- `X-Robots-Tag` response headers
- Canonical HTTP headers (if used)
- Content-Type headers

**Note on external Bun backend:** If the Bun backend serves only JSON APIs, do not run SEO checks against it. It is only an SEO surface if it serves public HTML or affects page availability.

### Layer 3 — Playwright rendered DOM

**Purpose:** Validate the **effective output** — what a search engine actually sees after rendering.

**Tool:** Playwright with Chromium.

**Required assertions per URL:**

```ts
const title = await page.title();
const description = await page.locator('meta[name="description"]').getAttribute('content');
const robots = await page.locator('meta[name="robots"]').getAttribute('content');
const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
const h1s = await page.locator('h1').allTextContents();
const lang = await page.locator('html').getAttribute('lang');
const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
const links = await page.locator('a[href]').evaluateAll(els => els.map(e => e.getAttribute('href')));
const images = await page.locator('img').evaluateAll(els => els.map(e => ({
  src: e.getAttribute('src'),
  alt: e.getAttribute('alt'),
  width: e.getAttribute('width'),
  height: e.getAttribute('height'),
  loading: e.getAttribute('loading'),
  fetchpriority: e.getAttribute('fetchpriority'),
})));
```

**SSR vs client-only comparison:** For Nuxt, compare the raw SSR HTML (`curl` output) with the rendered DOM. If critical content exists in neither, it is CRITICAL. If it exists only after client JS, it is WARNING (reliability risk; Google can render JS but it is not guaranteed).

---

## 3. Nuxt-Specific Context

The agent must understand these Nuxt primitives before validating.

### 3.1 Where SEO metadata lives in Nuxt

| Location | Purpose | SSR-safe? |
|---|---|---|
| `nuxt.config.ts` → `app.head` | Global defaults (title template, favicon, charset, viewport) | Yes |
| `app.vue` → `useHead()` | App-wide defaults | Yes |
| Page → `useSeoMeta()` | Preferred API for title, description, OG, Twitter | Yes |
| Page → `useHead()` | Lower-level head management (canonical, links, scripts) | Yes |
| Page → `definePageMeta()` | Route-level config (layout, middleware, `robots` via module) | Yes |
| Component → `useSeoMeta()` | Only valid if the component is rendered on the server for that route | Yes, if not in `onMounted` |
| `onMounted(() => useSeoMeta(...))` | ❌ Client-only — invisible to crawlers in the initial HTML | No |
| `useServerSeoMeta()` | Static, non-reactive SEO meta — better SSR perf | Yes |

**Rule:** SEO metadata MUST be set during SSR setup, not in lifecycle hooks.

### 3.2 Recommended module stack

| Module | Purpose |
|---|---|
| `@nuxtjs/seo` | Meta-module bundling the below |
| `@nuxtjs/sitemap` | Auto-generates `/sitemap.xml` from routes + dynamic sources |
| `@nuxtjs/robots` | Generates `/robots.txt` and injects `X-Robots-Tag` |
| `nuxt-schema-org` | `useSchemaOrg()` composable for JSON-LD |
| `nuxt-og-image` | Generates OG images |
| `nuxt-link-checker` | Detects broken internal links at build time |
| `nuxt-seo-utils` | Utilities for canonical, breadcrumbs, etc. |
| `@nuxt/image` | `<NuxtImg>` / `<NuxtPicture>` with automatic sizing |

The agent should verify these are installed and configured in `nuxt.config.ts`.

### 3.3 Common Nuxt SEO mistakes

| Mistake | Severity | Fix |
|---|---|---|
| `ssr: false` in `nuxt.config.ts` | CRITICAL | Set `ssr: true`; use hybrid rendering via `routeRules` if needed |
| `useSeoMeta` inside `onMounted` | CRITICAL | Move to `<script setup>` top level |
| SEO meta set from un-awaited `useAsyncData` | WARNING/CRITICAL | `await` the data before calling `useSeoMeta` |
| `<ClientOnly>` wrapping main content | CRITICAL | Remove or provide SSR fallback |
| Hardcoded `http://localhost:3000` in canonical | CRITICAL | Use `useRuntimeConfig().public.siteUrl` |
| Relative canonical URL | WARNING | Build absolute URL from runtime config |
| Missing `sitemap.sources` for dynamic routes | WARNING | Add dynamic sources in `nuxt.config.ts` |
| `<img>` without `width`/`height` | WARNING | Use `<NuxtImg>` with dimensions |
| Navigation via `<button @click>` or `<a @click>` | CRITICAL | Use `<NuxtLink>` (renders `<a href>`) |
| External links missing `rel="noopener"` | INFO | Add `rel="noopener"` for `target="_blank"` |
| `v-html` for critical body content | WARNING | Ensure content is server-rendered and safe |
| Duplicate `useSeoMeta` in layout + page | WARNING | Centralize in a `useSeo()` composable |

---

## 4. Validation Checks

Each check has an ID, severity, description, method, and (where applicable) a Nuxt refactor.

### 4.1 Crawlability & Indexation

| ID | Severity | Check | Method |
|---|---|---|---|
| CRAWL-01 | CRITICAL | `robots.txt` is reachable and does not block important URLs | HTTP: `GET /robots.txt` |
| CRAWL-02 | CRITICAL | Important URLs return 200 (not 4xx/5xx) | HTTP: HEAD each important URL |
| CRAWL-03 | CRITICAL | No unintended `noindex` in `<meta name="robots">` on important pages | Playwright DOM |
| CRAWL-04 | CRITICAL | No unintended `X-Robots-Tag: noindex` header | HTTP: check response headers |
| CRAWL-05 | CRITICAL | No redirect loops | HTTP: follow redirects, detect cycles |
| CRAWL-06 | CRITICAL | Redirects reach the intended destination | HTTP: follow redirects |
| CRAWL-07 | WARNING | Redirect chains are not excessive (>1 hop) | HTTP |
| CRAWL-08 | CRITICAL | `sitemap.xml` is parseable as XML | HTTP + XML parser |
| CRAWL-09 | WARNING | Every sitemap URL returns 200 and is canonical | HTTP: HEAD each sitemap URL |
| CRAWL-10 | WARNING | `robots.txt` references the sitemap | Text parse |
| CRAWL-11 | CRITICAL | `ssr: true` in production `nuxt.config.ts` | Static: read config |
| CRAWL-12 | CRITICAL | Important pages reachable via internal `<a href>` links | Playwright: link graph |

**Nuxt refactor notes:**

- If `ssr: false`, enable SSR or use `routeRules` for hybrid rendering per route.
- If sitemap URLs are missing dynamic routes, configure `sitemap.sources`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
})
```

```ts
// server/api/__sitemap__/urls.ts
export default defineEventHandler(async () => {
  const posts = await fetchPosts()
  return posts.map(p => ({
    loc: `/blog/${p.slug}`,
    lastmod: p.updatedAt,
  }))
})
```

- If a route should redirect, prefer `routeRules`:

```ts
routeRules: {
  '/old-page': { redirect: { to: '/new-page', statusCode: 301 } },
}
```

### 4.2 Canonicalization

| ID | Severity | Check | Method |
|---|---|---|---|
| CANON-01 | WARNING | Every important indexable page has a canonical | Playwright DOM |
| CANON-02 | CRITICAL | Multiple conflicting canonicals on one page | Playwright DOM |
| CANON-03 | CRITICAL | Canonical points to a 4xx/5xx URL | Playwright + HTTP |
| CANON-04 | CRITICAL | Canonical points to a `noindex` URL | Playwright + DOM of target |
| CANON-05 | CRITICAL | Canonical points to a different production host or path than intended | Playwright + runtime config |
| CANON-06 | WARNING | Canonical is relative, not absolute | Playwright DOM |
| CANON-07 | INFO | Parameterized URLs consolidate to a clean canonical | Manual review |

**Not an error:** `/article?page=2` → canonical `/article`. Parameter consolidation is intentional.

**Nuxt refactor:**

```vue
<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()

useHead({
  link: [
    { rel: 'canonical', href: `${config.public.siteUrl}${route.path}` },
  ],
})
</script>
```

Or use `nuxt-seo-utils`:

```vue
<script setup lang="ts">
useSeoMeta({
  canonical: `${useRuntimeConfig().public.siteUrl}${useRoute().path}`,
})
</script>
```

### 4.3 Meta Tags (Title, Description)

| ID | Severity | Check | Method |
|---|---|---|---|
| META-01 | WARNING | Every important page has a `<title>` | Playwright DOM |
| META-02 | WARNING | Titles are unique across the site | Crawl graph |
| META-03 | WARNING | Title is descriptive and relevant to the page | Manual / LLM review |
| META-04 | WARNING | Every important page has a meta description | Playwright DOM |
| META-05 | WARNING | Meta descriptions are unique | Crawl graph |
| META-06 | CRITICAL | Title is not the default fallback on important pages | Playwright DOM |
| META-07 | WARNING | Viewport meta tag is present | Playwright DOM |
| META-08 | WARNING | `<html lang>` is present and correct | Playwright DOM |
| META-09 | INFO | Title length is reasonable for display | Heuristic only |

**Do not enforce:** title character count, meta description character count, keyword position, brand suffix. These are not Google requirements.

**Nuxt refactor:**

```vue
<script setup lang="ts">
const { data: page } = await useAsyncData('page', () => fetchPage(route.path))

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description,
  ogTitle: () => page.value?.title,
  ogDescription: () => page.value?.description,
  ogImage: () => `${useRuntimeConfig().public.siteUrl}${page.value?.image}`,
  ogUrl: () => `${useRuntimeConfig().public.siteUrl}${useRoute().path}`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>
```

Centralize in a composable:

```ts
// composables/useSeo.ts
export function useSeo(meta: {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article'
}) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const url = `${config.public.siteUrl}${route.path}`

  useSeoMeta({
    title: meta.title,
    description: meta.description,
    ogTitle: meta.title,
    ogDescription: meta.description,
    ogImage: meta.image ? `${config.public.siteUrl}${meta.image}` : undefined,
    ogUrl: url,
    ogType: meta.type ?? 'website',
    twitterCard: 'summary_large_image',
  })

  useHead({
    link: [{ rel: 'canonical', href: url }],
  })
}
```

### 4.4 Document Structure

| ID | Severity | Check | Method |
|---|---|---|---|
| STRUCT-01 | WARNING | Page has a primary `<h1>` | Playwright DOM |
| STRUCT-02 | WARNING | More than one `<h1>` on a page | Playwright DOM |
| STRUCT-03 | WARNING | Heading hierarchy does not skip levels | Playwright DOM |
| STRUCT-04 | INFO | Semantic HTML5 landmarks used (`<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`) | Playwright DOM |
| STRUCT-05 | WARNING | Important content exists as text, not embedded in images | Manual / OCR |

**Not CRITICAL:** multiple H1s, skipped heading levels. These are quality issues, not indexation blockers.

### 4.5 Images

| ID | Severity | Check | Method |
|---|---|---|---|
| IMG-01 | WARNING | Meaningful images have descriptive `alt` | Playwright DOM |
| IMG-02 | WARNING | Images have explicit `width`/`height` or aspect ratio | Playwright DOM / AST |
| IMG-03 | WARNING | LCP image is not `loading="lazy"` | AST + Playwright |
| IMG-04 | INFO | LCP image uses `fetchpriority="high"` | AST |
| IMG-05 | INFO | Image filenames are descriptive | AST |

**Decorative images:** `alt=""` is correct. Do not flag empty alt on decorative images.

**Nuxt refactor:**

```vue
<NuxtImg
  src="/images/hero.jpg"
  alt="Mayon volcano at sunrise"
  width="1200"
  height="630"
  :loading="isAboveFold ? 'eager' : 'lazy'"
  :fetchpriority="isAboveFold ? 'high' : 'auto'"
/>
```

### 4.6 Links

| ID | Severity | Check | Method |
|---|---|---|---|
| LINK-01 | CRITICAL | Internal navigation uses `<a href>` (or `<NuxtLink>`) | AST + Playwright |
| LINK-02 | WARNING | No broken internal links | `nuxt-link-checker` or crawl |
| LINK-03 | WARNING | Anchor text is descriptive, not "click here" | Manual / LLM |
| LINK-04 | INFO | External links use `rel="noopener"` when `target="_blank"` | AST |

**Nuxt refactor:**

```vue
<!-- Bad -->
<button @click="navigateTo('/about')">About</button>

<!-- Good -->
<NuxtLink to="/about">About us</NuxtLink>
```

### 4.7 Structured Data (JSON-LD)

| ID | Severity | Check | Method |
|---|---|---|---|
| SD-01 | WARNING | JSON-LD is valid JSON | Playwright DOM + parse |
| SD-02 | WARNING | JSON-LD uses `@context: https://schema.org` | Parse |
| SD-03 | WARNING | Schema type matches the page type | Page-type matrix (§5) |
| SD-04 | WARNING | Required properties for the chosen type are present | Schema validation |
| SD-05 | WARNING | Marked-up content is visible on the page | Manual / DOM comparison |
| SD-06 | INFO | Optional properties enhance the markup | Schema validation |

**Nuxt refactor:**

```vue
<script setup lang="ts">
useSchemaOrg([
  defineWebSite({ name: 'Albay Tourist' }),
  defineOrganization({
    name: 'Albay Tourist',
    logo: 'https://albaytourist.com/logo.png',
    sameAs: ['https://facebook.com/albaytourist'],
  }),
])
</script>
```

### 4.8 Social Metadata

| ID | Severity | Check | Method |
|---|---|---|---|
| SOC-01 | WARNING | `og:title`, `og:description`, `og:image`, `og:url`, `og:type` present | Playwright DOM |
| SOC-02 | WARNING | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` present | Playwright DOM |
| SOC-03 | INFO | OG image is absolute HTTPS URL and fetchable | HTTP |
| SOC-04 | INFO | OG image dimensions are appropriate for social preview | HTTP |

**Not SEO-critical.** These affect social sharing, not Google organic ranking.

### 4.9 Performance (static assertions only)

| ID | Severity | Check | Method |
|---|---|---|---|
| PERF-01 | WARNING | LCP image not lazy-loaded | AST |
| PERF-02 | WARNING | Images have dimensions to prevent CLS | AST |
| PERF-03 | INFO | Fonts use `font-display: swap` or `optional` | AST / CSS |
| PERF-04 | INFO | No render-blocking third-party scripts above the fold | Manual |

**Do not gate on measured Core Web Vitals pre-deploy.** LCP/INP/CLS measurement belongs to deployment monitoring, not the build gate. Only assert deterministic implementation facts.

### 4.10 Mobile & International

| ID | Severity | Check | Method |
|---|---|---|---|
| MOB-01 | CRITICAL | Mobile and desktop render the same important content | Playwright at both viewports |
| MOB-02 | WARNING | Viewport meta present (see META-07) | Playwright |
| INT-01 | WARNING | `hreflang` links are reciprocal and valid (if multi-region) | Playwright DOM + HTTP |
| INT-02 | WARNING | `hreflang` used only when regional variants exist | Static |
| INT-03 | INFO | Locale URL strategy is consistent (prefix, subdomain, or ccTLD) | Static |

**Do not require** `/en/`, `/de/` prefix. That is one valid strategy among several.

---

## 5. Page-Type Conditional Schema

Do not enforce schema types globally. Detect the page type, then apply only the relevant rules.

| Page type | Required schema | Optional schema |
|---|---|---|
| Homepage | `WebSite`, `Organization` | `BreadcrumbList` |
| Tourist spot / attraction | `TouristAttraction` (or specific subtype), `BreadcrumbList` | `ImageObject`, `GeoCoordinates` |
| Restaurant / food | `Restaurant` (or specific subtype), `BreadcrumbList` | `Menu`, `Review` |
| Blog / article | `Article` or `BlogPosting`, `BreadcrumbList` | `Person` (author) |
| Product | `Product`, `BreadcrumbList` | `Offer`, `AggregateRating` |
| Contact / about | `WebPage`, `Organization` | `LocalBusiness` |
| FAQ | `FAQPage` (schema.org valid, no Google rich result since 2023) | — |

The agent should:

1. Classify the page (from route, layout, or `definePageMeta`).
2. Apply only the corresponding schema rules.
3. Mark optional schema absence as INFO, not WARNING.

---

## 6. Agent Workflow

The agent should execute these steps in order.

### Step 1 — Static reconnaissance

```bash
# Identify Nuxt version and modules
cat package.json
cat nuxt.config.ts

# Find SEO-relevant files
find . -name "*.vue" -not -path "./node_modules/*" | head -50
grep -rn "useSeoMeta\|useHead\|definePageMeta" --include="*.vue" .
grep -rn "ssr:" nuxt.config.ts
grep -rn "ClientOnly" --include="*.vue" .
grep -rn "onMounted" --include="*.vue" . | grep -i "seo\|head\|meta"
```

Record:

- Nuxt version
- Whether `ssr` is enabled
- Which SEO modules are installed
- Where SEO metadata is declared
- Any `onMounted` SEO usage (red flag)
- Any `<ClientOnly>` wrapping main content (red flag)

### Step 2 — Build the production bundle

```bash
nuxi build
node .output/server/index.mjs &
```

Or, for preview:

```bash
nuxi build
nuxi preview
```

### Step 3 — HTTP validation

```bash
SITE=http://localhost:3000

curl -sS -o /dev/null -w "%{http_code}\n" $SITE/
curl -sS $SITE/robots.txt
curl -sS $SITE/sitemap.xml | head -50
curl -sSI $SITE/ | grep -i "x-robots-tag\|content-type"
```

Parse and validate. Record all CRITICAL HTTP findings.

### Step 4 — Rendered DOM validation

For each important URL from the sitemap:

```ts
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(url, { waitUntil: 'networkidle' })

const checks = {
  status: (await page.goto(url)).status(),
  title: await page.title(),
  description: await page.locator('meta[name="description"]').getAttribute('content'),
  robots: await page.locator('meta[name="robots"]').getAttribute('content'),
  canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
  h1s: await page.locator('h1').allTextContents(),
  lang: await page.locator('html').getAttribute('lang'),
  jsonLd: await page.locator('script[type="application/ld+json"]').allTextContents(),
}
```

Apply all Playwright checks from §4.

### Step 5 — SSR vs rendered comparison

```bash
curl -sS $SITE/important-page > /tmp/ssr.html
```

Compare `document.title`, `h1` text, and canonical between `/tmp/ssr.html` and the Playwright DOM.

- If content is in **both** → OK.
- If content is in **Playwright only** → WARNING (client-only rendering).
- If content is in **neither** → CRITICAL (missing content).

### Step 6 — Cross-page checks

Collect all titles, descriptions, and canonicals across the crawl and check for:

- Duplicate titles → WARNING
- Duplicate descriptions → WARNING
- Duplicate canonicals pointing to different pages → CRITICAL
- Conflicting canonicals → CRITICAL

### Step 7 — Emit report

```markdown
## SEO Validation Report

**Build:** <commit sha>
**Date:** <ISO timestamp>
**Site URL:** <base url>
**URLs validated:** N

### CRITICAL (build fails)

| ID | URL | Finding | Suggested fix |
|---|---|---|---|
| CRAWL-03 | /tourist-spot/x | Unintended `noindex` in meta robots | Remove from `useSeoMeta` in `pages/tourist-spot/[slug].vue` |

### WARNING

| ID | URL | Finding | Suggested fix |
|---|---|---|---|
| META-01 | /about | Missing meta description | Add `useSeoMeta({ description })` |

### INFO

| ID | URL | Finding |
|---|---|---|
| IMG-05 | /gallery | Filenames are `IMG_001.jpg` |

### Summary

- CRITICAL: N
- WARNING: N
- INFO: N
- Pages passing all CRITICAL checks: N/M
```

---

## 7. Refactoring Guide

When the agent is asked to refactor, apply these patterns.

### 7.1 Centralize SEO metadata

Create `composables/useSeo.ts` (see §4.3). Replace ad-hoc `useSeoMeta` calls in pages with `useSeo({ title, description, image })`.

### 7.2 Enforce absolute URLs

Add `siteUrl` to `runtimeConfig`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
    },
  },
})
```

Never hardcode URLs. Always use `useRuntimeConfig().public.siteUrl`.

### 7.3 Use `<NuxtLink>` for navigation

Replace:

```vue
<a href="#" @click.prevent="go('/about')">About</a>
<button @click="go('/about')">About</button>
```

With:

```vue
<NuxtLink to="/about">About</NuxtLink>
```

### 7.4 Use `<NuxtImg>` for images

Replace:

```vue
<img src="/hero.jpg">
```

With:

```vue
<NuxtImg src="/hero.jpg" alt="..." width="1200" height="630" />
```

### 7.5 Remove `onMounted`-only SEO

Replace:

```vue
<script setup>
onMounted(() => {
  useSeoMeta({ title: 'Page' })
})
</script>
```

With:

```vue
<script setup>
useSeoMeta({ title: 'Page' })
</script>
```

### 7.6 Add SSR fallback to `<ClientOnly>`

Replace:

```vue
<ClientOnly>
  <MainContent />
</ClientOnly>
```

With:

```vue
<ClientOnly>
  <MainContent />
  <template #fallback>
    <MainContentStatic />
  </template>
</ClientOnly>
```

Or remove `<ClientOnly>` if it wraps critical content.

### 7.7 Configure sitemap dynamic sources

Add API endpoints under `server/api/__sitemap__/` and reference them in `nuxt.config.ts` (see §4.1).

### 7.8 Configure robots.txt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  robots: {
    disallow: ['/admin', '/cart', '/search'],
    allow: '/',
    sitemap: '/sitemap.xml',
  },
})
```

### 7.9 Add page-type schema

For each page template, add `useSchemaOrg()` with the correct type (see §5).

---

## 8. What NOT to Check

The agent MUST NOT flag the following as CRITICAL or WARNING:

```text
- title length outside 50–60 characters
- meta description length outside 140–160 characters
- primary keyword position in title
- brand suffix in title
- missing web app manifest
- missing Open Graph image at exactly 1200×630
- use of JavaScript to set metadata (if SSR output is correct)
- multiple H1 elements
- skipped heading levels
- redirect chains longer than 1 hop
- AI-generated content (detect, do not fail)
- question headings with 40–60 word answers
- specific locale URL prefixes (/en/, /de/)
- presence of specific optional schema properties
- font-display: swap as a universal requirement
- noopener/noreferrer on every external link
- measured Core Web Vitals pre-deploy
- any check that requires an external SEO tool's opinion
```

These are either arbitrary thresholds, contextual best practices, or post-deploy concerns.

---

## 9. Sources

Use these as the authoritative references when a rule is questioned.

| Topic | Source |
|---|---|
| How Search works | https://developers.google.com/search/docs/fundamentals/how-search-works |
| Crawling & indexing | https://developers.google.com/search/docs/crawling-indexing |
| Sitemaps | https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview |
| Canonicalization | https://developers.google.com/search/docs/crawling-indexing/canonicalization |
| Redirects | https://developers.google.com/search/docs/crawling-indexing/301-redirects |
| Title links | https://developers.google.com/search/docs/appearance/title-link |
| Meta descriptions | https://developers.google.com/search/docs/appearance/snippet |
| Structured data policies | https://developers.google.com/search/docs/appearance/structured-data/sd-policies |
| JavaScript SEO | https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics |
| Image SEO | https://developers.google.com/search/docs/appearance/google-images |
| Link best practices | https://developers.google.com/search/docs/crawling-indexing/links-crawlable |
| AI features | https://developers.google.com/search/docs/appearance/ai-features |
| People-first content | https://developers.google.com/search/docs/fundamentals/creating-helpful-content |
| Core Web Vitals | https://web.dev/articles/vitals |
| Nuxt SEO | https://nuxtseo.com/ |

**If a rule in this document conflicts with a source above, the source wins.** Update the document, do not silently diverge.

---

## 10. Change Control

This specification is frozen at v1.0.

- Do not add new CRITICAL checks without a source citation from §9.
- Do not add character-count, word-count, or hop-count thresholds.
- Do not add checks that require post-deploy measurement.
- Proposed changes must be justified by a real false positive or false negative observed in a validation run.

When the agent encounters a case this document does not cover:

1. Mark it as `INFO` with a note.
2. Do not fail the build.
3. Record it for the next spec revision.

---

**End of specification.**