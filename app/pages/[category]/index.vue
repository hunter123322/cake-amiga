<script setup lang="ts">
import type { CategorySlug } from '~/types/shop'
import { CATEGORY_BY_SLUG, isCategorySlug } from '~/data/shop/categories'
import { breadcrumbJsonLd } from '~/composables/useShopSeo'
import { SHOP_INFO } from '~/data/shop/info'

definePageMeta({ layout: 'public' })

const route = useRoute()
const slug = String(route.params.category ?? '')

if (!isCategorySlug(slug)) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true })
}

const category = computed(() => slug as CategorySlug)
const meta = CATEGORY_BY_SLUG[slug]

const view = useCatalogView(category)
const store = useCatalogStore()

/** The next page is a URL, so "Load more" is a link a crawler can follow. */
const moreTo = computed(() => ({
  path: route.path,
  query: { ...route.query, page: String(view.filters.value.page + 1) },
}))

const itemCount = computed(() => store.byCategory(slug).length)

/** Straight from the hardcoded catalogue, so the hero can state a real price. */
const fromLabel = computed(() => {
  const products = store.byCategory(slug)
  if (!products.length) return ''
  return `₱${Math.min(...products.map((product) => product.priceFrom)).toLocaleString('en-PH')}`
})

useShopSeo({
  title: meta.seoTitle,
  description: meta.seoDescription,
  path: `/${slug}`,
  image: meta.cover,
  jsonLd: [
    breadcrumbJsonLd([
      { name: 'Home', url: `${useSiteUrl()}/` },
      { name: meta.label, url: `${useSiteUrl()}/${slug}` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: meta.h1,
      numberOfItems: itemCount.value,
      itemListElement: view.results.value.slice(0, 20).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: `${useSiteUrl()}/${slug}/${product.slug}`,
      })),
    },
  ],
})
</script>

<template>
  <div>
    <section class="border-b border-slate-900/5 bg-gradient-to-b from-amber-50/80 to-transparent">
      <div class="mx-auto w-full max-w-7xl px-4 pb-4 pt-4 lg:px-8 lg:pb-8 lg:pt-12">
        <nav aria-label="Breadcrumb" class="text-xs text-slate-400">
          <ol class="flex items-center gap-1.5">
            <li><NuxtLink to="/" class="transition hover:text-slate-600">Home</NuxtLink></li>
            <li aria-hidden="true">/</li>
            <li class="font-medium text-slate-600" aria-current="page">{{ meta.label }}</li>
          </ol>
        </nav>

        <p class="mt-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-700/80">
          <UiIcon :name="meta.icon" class="h-4 w-4" />
          {{ meta.tagline }}
        </p>
        <h1 class="mt-1.5 text-[26px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-3xl lg:text-4xl">{{ meta.h1 }}</h1>
        <p class="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 lg:text-base">{{ meta.intro }}</p>

        <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-600">
          <li class="flex items-center gap-1.5">
            <UiIcon name="grid" class="h-3.5 w-3.5 text-amber-600" />
            {{ itemCount }} designs
          </li>
          <li v-if="fromLabel" class="flex items-center gap-1.5">
            <UiIcon name="tag" class="h-3.5 w-3.5 text-amber-600" />
            From {{ fromLabel }}
          </li>
          <li class="flex items-center gap-1.5">
            <UiIcon name="clock" class="h-3.5 w-3.5 text-amber-600" />
            {{ meta.leadNote }}
          </li>
          <li class="flex items-center gap-1.5">
            <UiIcon name="chat" class="h-3.5 w-3.5 text-amber-600" />
            Order by message
          </li>
        </ul>
      </div>
    </section>

    <div class="mx-auto w-full max-w-7xl px-4 pb-16 pt-4 lg:px-8">
      <CategoryPills class="mb-4" />
      <FilterToolbar
        :q="view.filters.value.q"
        :sort="view.filters.value.sort"
        :max-price="view.filters.value.maxPrice"
        :saved="view.filters.value.saved"
        :facets="view.filters.value.facets"
        :facet-defs="view.facets.value"
        :price-pills="view.pricePills.value"
        :total="view.total.value"
        :is-filtered="view.isFiltered.value"
        @update:q="view.search"
        @update:sort="view.setSort"
        @update:max-price="view.setMaxPrice"
        @update:saved="view.toggleSaved"
        @update:facet="view.setFacet"
        @reset="view.resetAll"
      />

      <div class="mt-6">
        <ProductGrid
          :items="view.items.value"
          :total="view.total.value"
          :has-more="view.hasMore.value"
          :more-to="moreTo"
          :category="slug"
          :is-filtered="view.isFiltered.value"
          @reset="view.resetAll"
        />
      </div>

      <div class="mt-12">
        <CtaBanner :category="slug" :order-note="meta.orderNote" />
      </div>

      <p class="mt-6 text-center text-xs text-slate-400">
        Pickup in {{ SHOP_INFO.address.city }}, {{ SHOP_INFO.address.province }} ·
        <a :href="SHOP_INFO.mapLink" target="_blank" rel="noopener" class="underline decoration-dotted hover:text-slate-600">
          open in Maps
        </a>
      </p>
    </div>
  </div>
</template>
