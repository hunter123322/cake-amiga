<script setup lang="ts">
import { CATEGORIES } from '~/data/shop/categories'
import { SHOP_INFO, SHOP_ADDRESS_LINE } from '~/data/shop/info'

definePageMeta({ layout: 'public' })

const store = useCatalogStore()
// Stored edits (and favourites) live in this browser, so they are read after mount.
onMounted(() => store.hydrate())

const openStatus = useOpenStatus()
const { track } = useInquiry()

/** Real numbers straight from the hardcoded catalogue — no invented proof. */
const cakePrices = computed(() => (store.byCategory('cakes') as { priceFrom: number }[]).map((cake) => cake.priceFrom))
const cheapestCake = computed(() => {
  const lowest = Math.min(...cakePrices.value)
  return Number.isFinite(lowest) ? `₱${lowest.toLocaleString('en-PH')}` : '₱480'
})
const shortestLeadTime = computed(() => {
  const leads = store.byCategory('cakes').map((cake) => Number.parseInt(cake.leadTime, 10))
  const days = Math.min(...leads.filter((value) => Number.isFinite(value)))
  return Number.isFinite(days) && days > 1 ? `${days} days` : 'same day'
})

const featured = computed(() =>
  store.products
    .filter((product) => product.active && product.featured)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8),
)

const categoryTiles = computed(() =>
  CATEGORIES.map((category) => {
    const products = store.byCategory(category.slug)
    return {
      ...category,
      count: products.length,
      from: products.length ? Math.min(...products.map((product) => product.priceFrom)) : 0,
    }
  }),
)

const promises = [
  { icon: 'sparkle', title: 'Baked to order', copy: 'Cakes are made the morning you collect them — never frozen, never re-iced.' },
  { icon: 'map-pin', title: 'Pickup in Bacacay', copy: SHOP_ADDRESS_LINE },
  { icon: 'chat', title: 'Order by message', copy: 'Messenger, Viber or a straight phone call — no account, no checkout queue.' },
  { icon: 'cup', title: 'Coffee with that', copy: 'Bicol arabica and liberica, brewed while your cake is being boxed.' },
]

useShopSeo({
  title: 'Cake Amiga — Cakes, Coffee & Donuts in Bacacay, Albay',
  description:
    'A bakery and café in Bacacay, Albay. Order celebration cakes, donuts, coffee and drinks for pickup or delivery within 10 km. Build your own cake online.',
  path: '/',
  image: CATEGORIES[0]?.cover,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SHOP_INFO.name,
      url: useSiteUrl(),
      inLanguage: 'en-PH',
    },
  ],
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden">
      <div class="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-6 pt-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center lg:gap-14 lg:px-8 lg:pb-14 lg:pt-14">
        <div class="lg:col-start-1 lg:row-start-1">
          <p class="flex flex-wrap items-center gap-x-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-700/90">
            <UiIcon name="map-pin" class="h-4 w-4" />
            {{ SHOP_INFO.address.city }}, {{ SHOP_INFO.address.province }}
            <span v-if="openStatus.ready.value" class="inline-flex items-center gap-1.5 font-semibold normal-case tracking-normal text-slate-500">
              <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full" :class="openStatus.isOpen.value ? 'bg-emerald-500' : 'bg-rose-400'" />
              {{ openStatus.label.value }}
            </span>
          </p>
          <h1 class="mt-2.5 text-[28px] font-extrabold leading-[1.06] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
            Cakes baked fresh in Bacacay.
          </h1>

          <p v-if="SHOP_INFO.rating" class="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 font-bold text-amber-900">
              <UiIcon name="star" class="h-4 w-4 text-amber-500" />
              {{ SHOP_INFO.rating.stars.toFixed(1) }}
            </span>
            <a
              :href="SHOP_INFO.rating.url"
              target="_blank"
              rel="noopener"
              class="font-semibold text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-slate-900"
            >
              {{ SHOP_INFO.rating.count }} {{ SHOP_INFO.rating.source }} reviews
            </a>
            <span v-if="SHOP_INFO.rating.recentNote" class="text-xs text-slate-400">{{ SHOP_INFO.rating.recentNote }}</span>
          </p>

          <p class="mt-3 text-sm font-semibold text-slate-700">
            Cakes from {{ cheapestCake }} · ready in {{ shortestLeadTime }}
          </p>

          <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <a
              :href="SHOP_INFO.messenger"
              target="_blank"
              rel="noopener"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition active:scale-[0.97] hover:bg-slate-800"
              @click="track('click_order', { channel: 'messenger', source: 'home_hero' })"
            >
              <UiIcon name="chat" class="h-4 w-4" />
              Order on Messenger
            </a>
            <NuxtLink
              to="/cake-builder"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-amber-100 px-5 text-sm font-semibold text-amber-800 transition active:scale-[0.97] hover:bg-amber-200"
            >
              <UiIcon name="sparkle" class="h-4 w-4" />
              Build your own cake
            </NuxtLink>
          </div>
        </div>

        <div class="relative mx-auto w-full max-w-[240px] sm:max-w-[280px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-center">
          <div class="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] ring-1 ring-slate-900/5">
            <ShopImage
              src="/img/cake/red_rose_bdayCake.webp"
              alt="A red rose birthday cake baked at Cake Amiga in Bacacay"
              sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 340px"
              priority
            />
          </div>
          <p class="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-[0_12px_30px_-14px_rgba(15,23,42,0.4)]">
            <UiIcon name="clock" class="h-3.5 w-3.5 text-amber-600" />
            Baked this morning
          </p>
        </div>

        <div class="lg:col-start-1 lg:row-start-2">
          <p class="text-sm leading-relaxed text-slate-600 lg:text-base">
            Also doughnuts, coffee and cold drinks. Order by message — pickup in
            {{ SHOP_INFO.address.city }} or delivery within 10 km.
          </p>
          <ul class="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <li class="flex items-center gap-1.5">
              <UiIcon name="check" class="h-3.5 w-3.5 text-emerald-600" />
              No checkout, no account
            </li>
            <li class="flex items-center gap-1.5">
              <UiIcon name="clock" class="h-3.5 w-3.5 text-emerald-600" />
              Same-day donuts & drinks
            </li>
            <li class="flex items-center gap-1.5">
              <UiIcon name="map-pin" class="h-3.5 w-3.5 text-emerald-600" />
              Delivery from ₱80
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section aria-labelledby="categories-heading" class="mx-auto w-full max-w-7xl px-4 pt-6 lg:px-8 lg:pt-12">
      <h2 id="categories-heading" class="text-lg font-extrabold tracking-[-0.02em] lg:text-xl">What we make</h2>
      <p class="mt-1 text-sm text-slate-500">Four lists, updated whenever the menu changes.</p>
      <ul class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <li v-for="tile in categoryTiles" :key="tile.slug">
          <NuxtLink
            :to="`/${tile.slug}`"
            class="flex h-full flex-col gap-2 rounded-3xl bg-white p-4 ring-1 ring-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)]"
          >
            <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <UiIcon :name="tile.icon" class="h-5 w-5" />
            </span>
            <span class="text-base font-bold tracking-[-0.01em]">{{ tile.label }}</span>
            <span class="text-xs leading-relaxed text-slate-500">{{ tile.tagline }}</span>
            <span class="mt-auto pt-2 text-xs font-semibold text-slate-400">
              {{ tile.count }} items · from ₱{{ tile.from.toLocaleString('en-PH') }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section v-if="featured.length" aria-labelledby="featured-heading" class="mx-auto w-full max-w-7xl px-4 pt-12 lg:px-8 lg:pt-16">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 id="featured-heading" class="text-lg font-extrabold tracking-[-0.02em] lg:text-xl">Bestsellers this week</h2>
          <p class="mt-1 text-sm text-slate-500">The ones that sell out before noon.</p>
        </div>
        <NuxtLink to="/menu" class="shrink-0 text-sm font-semibold text-slate-500 transition hover:text-slate-900">
          Full menu →
        </NuxtLink>
      </div>
      <ul class="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        <li v-for="(product, index) in featured" :key="product.id" class="flex">
          <ProductCard :product="product" :priority="index < 4" class="w-full" />
        </li>
      </ul>
    </section>

    <section aria-labelledby="builder-heading" class="mx-auto w-full max-w-7xl px-4 pt-12 lg:px-8 lg:pt-16">
      <div class="overflow-hidden rounded-[32px] bg-slate-900 p-6 text-white lg:p-10">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="max-w-2xl">
            <p class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-amber-300/90">
              <UiIcon name="sparkle" class="h-4 w-4" />
              Cake builder
            </p>
            <h2 id="builder-heading" class="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.03em] lg:text-3xl">
              Build the cake, then send us the link.
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-white/70">
              Choose the tiers, flavours, coating, side design and topper and watch the price update as you go. When it
              looks right, send the link — we will confirm the schedule and start baking.
            </p>
          </div>
          <NuxtLink
            to="/cake-builder"
            class="inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-amber-400 px-6 text-sm font-bold text-slate-900 transition active:scale-[0.97] hover:bg-amber-300"
          >
            <UiIcon name="cake" class="h-4 w-4" />
            Open the builder
          </NuxtLink>
        </div>
      </div>
    </section>

    <section aria-labelledby="promises-heading" class="mx-auto w-full max-w-7xl px-4 pt-12 lg:px-8 lg:pt-16">
      <h2 id="promises-heading" class="sr-only">Why order from us</h2>
      <dl class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="promise in promises" :key="promise.title" class="rounded-3xl bg-white/70 p-4 ring-1 ring-slate-900/5">
          <dt class="flex items-center gap-2 text-sm font-bold text-slate-800">
            <UiIcon :name="promise.icon" class="h-4 w-4 shrink-0 text-amber-600" />
            {{ promise.title }}
          </dt>
          <dd class="mt-1.5 text-xs leading-relaxed text-slate-500">{{ promise.copy }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>
