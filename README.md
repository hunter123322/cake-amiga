# Cake Amiga — shop + cake builder

A Nuxt 4 site for a bakery and café in **Bacacay, Albay**: four shop directory pages (cakes,
drinks, coffee, donuts) plus the original **2D cake configurator**.

Built with **Nuxt 4**, **Tailwind CSS**, **Pinia** and **@nuxt/image**. Product photography lives in
`public/img` (authored 4:5 portrait); every cake-builder visual is still an inline SVG generated
procedurally in Vue components — no canvas, no 3D, no raster assets in the configurator.

## Pages

| Route | What it is |
|---|---|
| `/` | Home: hero, category tiles, bestsellers, cake-builder band |
| `/cakes`, `/drinks`, `/coffee`, `/donuts` | Category directories: search, sort, category-specific filters, 50-item cap, crawlable “load more” link (`?page=N`) |
| `/{category}/{slug}` | Product detail: 4:5 hero, variant table, prefilled order links, related items |
| `/menu` | All four lists in one page with jump links |
| `/about`, `/contact` | Story, hours, address, map, Messenger / Viber / phone |
| `/cake-builder` | The cake configurator (own full-screen layout) |

Orders are **messages, not checkouts**: every CTA opens Messenger, Viber or a phone dial with the
item, size and price already written into the message.

## Shop behaviour

- **Images** — every photo is 4:5 (`aspect-[4/5]` frames, so nothing is cropped). `ShopImage`
  renders `@nuxt/image`'s `<NuxtImg>`: lazy below the fold, `fetchpriority="high"` on the first
  row, explicit width/height (no layout shift) and WebP variants from IPX (a 320×400 card image is
  ~12 KB instead of the ~700 KB source).
- **Filtering** — search, sort (featured / newest / price / name), per-category facet dropdowns
  (occasion, flavour, size, brew, strength, glaze, filling) and price pills. The whole
  filter state round-trips through the query string, and it is applied during SSR, so a shared or
  crawled `?page=2` / `?q=…` link renders the same list the visitor sees.
- **Catalogue data** — `app/data/shop/*.ts` **is** the catalogue (cakes 50, drinks 12, coffee 9,
  donuts 15): plain TypeScript, no database and no CMS. Editing a product means editing
  those files; prices, sizes and copy ship with the code. The 50-item cap is a guard rail that warns
  in dev when a category grows past it. Favourites are the only thing kept in `localStorage`.
- **Photos missing** — items without an image render a labelled “photo coming soon” tile (also in
  4:5), so nothing looks broken while the menu is being photographed.
- **Cake cards** — every cake is named after its photograph (`red_rose_bdayCake.webp` → “Red Rose
  Bday Cake”), and `ProductCard.vue` repeats those titles, plus the eight “Best Seller” flags, as
  hardcoded strings. Cake cards show no price; prices stay on the detail pages, in search data and
  in the JSON-LD.
- **SEO** — per-page title/description/OG/canonical, JSON-LD (`Bakery` from the layout, `Product`
  with an `AggregateOffer` and `BreadcrumbList` per item, `FAQPage` on contact), plus
  `/sitemap.xml` (generated from the hardcoded catalogue) and `/robots.txt` — both server routes, so
  their URLs are built from the request origin and XML values are escaped.
- **First screen (mobile)** — the landing view leads with the location + live “open now / closed”
  badge, one front-loaded headline, a real price/lead-time line, **one** primary CTA
  (Messenger) and the hero photograph — then the tagline and trust chips. Nothing above the fold is
  invented: prices and lead times are read from the catalogue (`useOpenStatus`, `cheapestCake`).
- **Reviews** — `SHOP_INFO.rating` is `null` and the rating row simply does not render until you
  paste your real Google numbers into `app/data/shop/info.ts` (`stars`, `count`, `url`).

## Cake builder

- 1–5 tiers, each with diameter (8–12 in) and height (4–10 in) sliders
- Flavor, coating (finish + colour), side design, topper and extras via snap-scroll carousels
- Live painter's-algorithm preview with seeded randomness, slice view, price/weight/servings
- Undo / redo, randomizer, presets, copyable share link, confetti and optional selection chime
- Mobile-first (works at 320px), keyboard accessible, reduced-motion aware

## Setup

```bash
bun install        # or npm install
bun run dev        # http://localhost:3004
```

## Commands

| Command | Description |
|---|---|
| `bun run dev` | Dev server on port 3004 |
| `bun run build` | Production build (`.output`) |
| `bun run typecheck` | `vue-tsc` over the whole app (must stay clean) |
| `bun run preview` | Preview the production build |
| `bun run generate` | Static site generation |

## Project structure

```
app/
  layouts/       public.vue (header, nav, bottom nav, footer, LocalBusiness JSON-LD), minimal.vue, builder.vue
  pages/         index, menu, about, contact, cake-builder, [category]/index, [category]/[slug]
  components/
    shop/        ProductCard, ShopImage, PhotoPending, ShopBadge, CategoryPills, FilterToolbar,
                 ProductGrid, EmptyState, CtaBanner
    cake/        CakePreview, TierLayer, CoatingLayer, SideDesignLayer, TopDesignLayer, AddOnLayer, PlateLayer
    panels/      one panel per builder step (size, flavor, coating, side, top, extras, review)
    ui/          Stepper, ProgressBar, SwipeCarousel, RangeSlider, ColorPicker, PriceBar, Toast, ConfettiBurst, UiIcon
    svg/         SvgDefs + procedural assets: textures/, sides/, toppers/, addons/
  composables/   useCatalogView, useProductDisplay, useInquiry, useShopSeo, useOpenStatus, useCakeGeometry, ...
  stores/        catalog.ts (filters + favourites over the hardcoded catalogue), cake.ts (builder state)
  data/shop/     info, categories, imageLibrary, cakes, drinks, coffee, donuts
  data/          builder data: flavors, coatings, side designs, top designs, add-ons, presets
  types/         shared TypeScript types (shop.ts, cake.ts)
server/
  routes/        sitemap.xml.ts, robots.txt.ts
public/img/      cake/ (49), donut/ (15), drink/ (12), coffee/ (9) — all 4:5 portrait
```

## Rendering model (builder)

- `SCALE = 12` SVG units per inch, top-down tilt `ELLIPSE_RATIO = 0.20`
- Tiers are stacked bottom-up and drawn in painter's order; the viewBox auto-fits on every change
- All colors derive from the selected coating/design colours (`useColor` lighten/darken/mix)
- Randomised details (sprinkles, drips, textures) use seeded PRNGs (`useSvgSeed`) for stability

## Conversion notes (mobile)

Research summary for hooking a first-time mobile visitor — sources are the usual evidence base
(NN/g, web.dev, BrightLocal, Baymard, Deloitte, DataReportal PH 2025):

| Lever | Why it matters | Status |
|---|---|---|
| Everything decisive in the first viewport (>57% of viewing time is above the fold, NN/g) | “What, where, how much, how to order” must land before any scroll | **Done** — eyebrow + live open/closed, one headline, price/lead line, one primary CTA, then the photo |
| One clear primary CTA, not three | Competing buttons dilute the click (CXL fold guidance) | **Done** — Messenger primary, builder secondary, “See the menu” moved below the fold |
| Speed is a conversion lever (Vodafone: 31% faster LCP → +8% sales) | Image-heavy pages live or die on LCP | **Held** — hero eager + `fetchpriority=high`, 4:5 IPX WebP (~12 KB), width/height set, everything else lazy |
| Show price, lead time and pickup/delivery up front | Hidden cost/time is the top abandonment driver (Baymard) | **Done** — read from the catalogue, never invented |
| Messaging-first ordering (Messenger reaches 79% of PH adults) | The order *is* a chat | **Done** — every CTA opens a prefilled Messenger/Viber thread |
| Local trust: address, hours, “open now” | Local-intent visitors bounce without hours (BrightLocal) | **Done** — live status chip from `SHOP_INFO.periods` |
| Reviews with stars + recency, near the CTA | Strongest trust device for local businesses (BrightLocal) | **Waiting on real data** — set `SHOP_INFO.rating` |
| Kills bounce: carousels, popups, text walls, full-screen “false floor” heroes | NN/g, Search Central | **Avoided** — single static hero, no interstitials, category tiles peek above the fold |

## Notes

- **Images:** `image.screens` in `nuxt.config.ts` controls the widths IPX generates. `nuxt build`
  bundles sharp for the host platform (`@nuxt/image` prints a reminder); switch `image.provider` to
  a CDN before deploying to a different architecture, or run `nuxt generate` to emit the optimised
  files at build time.
- **Branding** — the store name lives in `app/data/shop/info.ts` (`SHOP_INFO.name`). The header logo
  is the artwork already in `public/` (`android-chrome-192x192.png`, optimised through IPX), and the
  favicon/apple-touch/manifest links in `nuxt.config.ts` point at the same set.
- **Store details** (phone, Messenger, Viber, e-mail, hours, address, map link) live in
  `app/data/shop/info.ts`. Replace the Messenger handle and the social URLs before launch; the
  phone, e-mail, address and coordinates are already the real ones. `robots.txt` needs no domain
  edit — it is generated from the request origin.
- **SEO validation** — `skill/SEO-VALIDATION.md` is the frozen spec for the three-layer check
  (static, HTTP, rendered DOM). Run it against a production build before launch; the report from the
  last run is kept in the session artifacts, not the repo.
- **Photo ↔ name pairing** lives in `app/data/shop/cakes.ts`: each product is named after its photo
  file, one-for-one with `public/img/cake`. `ProductCard.vue` holds the same titles (and the
  best-seller list) as hardcoded strings, so rename both when a photo changes.
- `nuxt.config.ts` inlines the Nuxt renderer **and Pinia** via `nitro.externals`:
  - Nuxt 4.6.0 on Windows serves every SSR page a 500
    (`Either manifest or precomputed data must be provided`) — [nuxt/nuxt#36467](https://github.com/nuxt/nuxt/issues/36467);
  - an external `pinia` copy makes every store-using page fail in production with
    `"getActivePinia()" was called but there was no active Pinia`.

  Both can be removed once the upstream issues are fixed.
