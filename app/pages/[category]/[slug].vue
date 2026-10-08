<script setup lang="ts">
import type { CategorySlug, ShopProduct } from '~/types/shop'
import { CATEGORY_BY_SLUG, isCategorySlug } from '~/data/shop/categories'
import { breadcrumbJsonLd, productJsonLd } from '~/composables/useShopSeo'
import { SHOP_INFO } from '~/data/shop/info'

definePageMeta({ layout: 'public' })

const route = useRoute()
const categorySlug = String(route.params.category ?? '')
const productSlug = String(route.params.slug ?? '')

const store = useCatalogStore()
// Stored edits live in this browser, so they are read after mount.
onMounted(() => store.hydrate())

const product = computed<ShopProduct | undefined>(() =>
  isCategorySlug(categorySlug) ? store.findBySlug(categorySlug, productSlug) : undefined,
)

if (!isCategorySlug(categorySlug) || !product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })
}

const item = product.value as ShopProduct
const meta = CATEGORY_BY_SLUG[categorySlug as CategorySlug]
const view = useCatalogView(computed(() => categorySlug as CategorySlug))
const { priceFromLabel, summaryLine, chips, variantRows, badgeLabel, badgeClass } = useProductDisplay()
const { messengerLink, viberLink, callLink, shareProduct, priceLine, track } = useInquiry()
const { pushToast } = useToasts()

const origin = useSiteUrl()
const url = `${origin}/${categorySlug}/${productSlug}`
const isFavorite = computed(() => mounted.value && store.isFavorite(item.id))
const variants = computed(() => variantRows(item))
const related = computed(() => view.related(item, 4))
/** Favourites live in local storage, so they are only known after mount. */
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
  track('view_product', { item_id: item.id, item_name: item.name, category: item.category })
})

const breadcrumbs = [
  { name: 'Home', url: `${origin}/` },
  { name: meta.label, url: `${origin}/${categorySlug}` },
  { name: item.name, url },
]

useShopSeo({
  title: `${item.name} — ${meta.label} in Bacacay, Albay | ${SHOP_INFO.name}`,
  description: item.description,
  path: `/${categorySlug}/${productSlug}`,
  image: item.images[0],
  type: 'product',
  jsonLd: [productJsonLd(item, url, origin), breadcrumbJsonLd(breadcrumbs)],
})

async function onShare() {
  const result = await shareProduct(item, url)
  if (result === 'copied') pushToast('Link copied to your clipboard')
  if (result === 'failed') pushToast('Could not copy the link', 'warn')
}
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-4 pb-16 pt-5 lg:px-8 lg:pt-8">
    <nav aria-label="Breadcrumb" class="text-xs text-slate-400">
      <ol class="flex flex-wrap items-center gap-1.5">
        <li><NuxtLink to="/" class="transition hover:text-slate-600">Home</NuxtLink></li>
        <li aria-hidden="true">/</li>
        <li><NuxtLink :to="`/${categorySlug}`" class="transition hover:text-slate-600">{{ meta.label }}</NuxtLink></li>
        <li aria-hidden="true">/</li>
        <li class="font-medium text-slate-600" aria-current="page">{{ item.name }}</li>
      </ol>
    </nav>

    <div class="mt-5 grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12">
      <div class="lg:sticky lg:top-24 lg:self-start">
        <div class="relative overflow-hidden rounded-[28px] bg-white ring-1 ring-slate-900/5">
          <div class="relative aspect-[4/5] w-full">
            <ShopImage
              :src="item.images[0]"
              :alt="`${item.name} — ${meta.label.toLowerCase()} at ${SHOP_INFO.name}`"
              :name="item.name"
              :icon="meta.icon"
              sizes="(max-width: 1024px) 100vw, 420px"
              priority
            />
            <div v-if="item.badges?.length" class="absolute left-4 top-4 flex flex-wrap gap-1.5">
              <ShopBadge v-for="badge in item.badges" :key="badge" :badge="badge" />
            </div>
          </div>
          <button
            type="button"
            class="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-slate-500 backdrop-blur transition active:scale-95 hover:text-rose-500"
            :aria-pressed="isFavorite"
            :aria-label="isFavorite ? 'Remove from saved' : 'Save this item'"
            @click="store.toggleFavorite(item.id)"
          >
            <UiIcon name="heart" class="h-5 w-5" :class="isFavorite ? 'fill-rose-500 text-rose-500' : ''" />
          </button>
        </div>
        <p class="mt-3 text-center text-xs text-slate-400">
          Photos are 4:5 and unedited — what you see is what leaves the kitchen.
        </p>
      </div>

      <div class="flex flex-col gap-6">
        <header class="flex flex-col gap-3">
          <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
              <UiIcon :name="meta.icon" class="h-3.5 w-3.5" />{{ meta.label }}
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">
              <UiIcon name="clock" class="h-3.5 w-3.5" />Ready in {{ item.leadTime }}
            </span>
          </div>
          <h1 class="text-2xl font-extrabold leading-tight tracking-[-0.03em] lg:text-3xl">{{ item.name }}</h1>
          <p class="text-sm text-slate-500">{{ summaryLine(item) }}</p>
          <p class="text-2xl font-extrabold tracking-[-0.02em]">{{ priceFromLabel(item) }}</p>
          <p class="text-sm leading-relaxed text-slate-600">{{ item.description }}</p>
          <ul v-if="chips(item).length" class="flex flex-wrap gap-1.5">
            <li v-for="chip in chips(item)" :key="chip" class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
              {{ chip }}
            </li>
          </ul>
        </header>

        <section aria-labelledby="variants-heading" class="rounded-3xl bg-white p-4 ring-1 ring-slate-900/5 lg:p-5">
          <h2 id="variants-heading" class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            {{ item.category === 'donuts' ? 'Boxes' : item.category === 'bread' ? 'Pack sizes' : 'Sizes & prices' }}
          </h2>
          <table class="mt-3 w-full text-sm">
            <tbody>
              <tr v-for="variant in variants" :key="variant.label" class="border-t border-slate-100 first:border-t-0">
                <th scope="row" class="py-2.5 pr-3 text-left font-semibold text-slate-800">{{ variant.label }}</th>
                <td class="py-2.5 pr-3 text-slate-500">{{ variant.detail }}</td>
                <td class="py-2.5 text-right font-bold text-slate-900">{{ variant.price }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="item.category === 'cakes'" class="mt-3 text-xs leading-relaxed text-slate-500">
            Need tiers or a custom message? <NuxtLink to="/cake-builder" class="font-semibold text-amber-700 underline decoration-dotted">Build your own cake</NuxtLink>
            and send us the link — we will confirm the sketch before baking.
          </p>
        </section>

        <section aria-labelledby="order-heading" class="rounded-3xl bg-gradient-to-br from-amber-50 to-rose-50 p-4 ring-1 ring-white/60 lg:p-5">
          <h2 id="order-heading" class="text-sm font-bold text-slate-900">Order “{{ item.name }}”</h2>
          <p class="mt-1 text-xs leading-relaxed text-slate-600">
            {{ SHOP_INFO.pickupNote }} {{ SHOP_INFO.deliveryNote }}
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <a
              :href="messengerLink(item)"
              target="_blank"
              rel="noopener"
              class="inline-flex h-12 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition active:scale-[0.97] hover:bg-slate-800"
              @click="track('click_order', { item_id: item.id, channel: 'messenger' })"
            >
              <UiIcon name="chat" class="h-4 w-4" />
              Order on Messenger
            </a>
            <a
              :href="viberLink(item)"
              class="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition active:scale-[0.97] hover:text-slate-900"
              @click="track('click_order', { item_id: item.id, channel: 'viber' })"
            >
              <UiIcon name="chat" class="h-4 w-4" />
              Viber
            </a>
            <a
              :href="callLink()"
              class="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition active:scale-[0.97] hover:text-slate-900"
              @click="track('click_order', { item_id: item.id, channel: 'phone' })"
            >
              <UiIcon name="phone" class="h-4 w-4" />
              {{ SHOP_INFO.phoneDisplay }}
            </a>
            <button
              type="button"
              class="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition active:scale-[0.97] hover:text-slate-900"
              @click="onShare"
            >
              <UiIcon name="share" class="h-4 w-4" />
              Share
            </button>
          </div>
          <p class="mt-3 text-xs text-slate-500">
            Prefer to ask first? Send <span class="font-semibold text-slate-700">{{ priceLine(item) }}</span> worth of
            questions — we answer between oven batches.
          </p>
        </section>

        <section v-if="related.length" aria-labelledby="related-heading">
          <h2 id="related-heading" class="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Pairs well with</h2>
          <ul class="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <li v-for="other in related" :key="other.id" class="flex">
              <ProductCard :product="other" class="w-full" />
            </li>
          </ul>
        </section>

        <p class="text-xs text-slate-400">
          <NuxtLink :to="`/${categorySlug}`" class="inline-flex items-center gap-1.5 font-semibold text-slate-500 transition hover:text-slate-800">
            <UiIcon name="chevron-left" class="h-3.5 w-3.5" />
            Back to {{ meta.label.toLowerCase() }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
