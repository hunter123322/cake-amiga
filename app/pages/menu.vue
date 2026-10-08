<script setup lang="ts">
import { CATEGORIES } from '~/data/shop/categories'

definePageMeta({ layout: 'public' })

const store = useCatalogStore()
// Stored edits (and favourites) live in this browser, so they are read after mount.
onMounted(() => store.hydrate())

const sections = computed(() =>
  CATEGORIES.map((category) => {
    const products = store.byCategory(category.slug).filter((product) => product.active)
    const featuredFirst = store.sortProducts(products, 'featured')
    return {
      category,
      total: products.length,
      from: products.length ? Math.min(...products.map((product) => product.priceFrom)) : 0,
      preview: featuredFirst.slice(0, 4),
    }
  }),
)

useShopSeo({
  title: 'Full Menu — Cakes, Drinks, Coffee & Donuts | Cake Amiga',
  description:
    'Everything we bake and brew in Bacacay, Albay in one place: celebration cakes, milk tea and fruit drinks, espresso and doughnuts, with prices in pesos.',
  path: '/menu',
})
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-4 pb-16 pt-7 lg:px-8 lg:pt-12">
    <nav aria-label="Breadcrumb" class="text-xs text-slate-400">
      <ol class="flex items-center gap-1.5">
        <li><NuxtLink to="/" class="transition hover:text-slate-600">Home</NuxtLink></li>
        <li aria-hidden="true">/</li>
        <li class="font-medium text-slate-600" aria-current="page">Full menu</li>
      </ol>
    </nav>

    <header class="mt-4 max-w-2xl">
      <h1 class="text-2xl font-extrabold leading-tight tracking-[-0.03em] lg:text-4xl">The full menu</h1>
      <p class="mt-2.5 text-sm leading-relaxed text-slate-600 lg:text-base">
        Everything on the counter today, grouped the way we sell it. Prices are in pesos and include the box; delivery
        within 10 km of Bacacay starts at ₱80.
      </p>
    </header>

    <nav aria-label="Jump to category" class="mt-6">
      <ul class="flex flex-wrap gap-2">
        <li v-for="section in sections" :key="section.category.slug">
          <a
            :href="`#${section.category.slug}`"
            class="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-3.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:text-slate-900 hover:ring-slate-300"
          >
            <UiIcon :name="section.category.icon" class="h-4 w-4" />
            {{ section.category.label }}
            <span class="text-xs font-normal text-slate-400">{{ section.total }}</span>
          </a>
        </li>
      </ul>
    </nav>

    <section
      v-for="(section, sectionIndex) in sections"
      :id="section.category.slug"
      :key="section.category.slug"
      class="scroll-mt-20 pt-12 lg:pt-16"
      :aria-labelledby="`${section.category.slug}-heading`"
    >
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 :id="`${section.category.slug}-heading`" class="text-xl font-extrabold tracking-[-0.025em]">
            {{ section.category.label }}
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ section.category.tagline }} · {{ section.total }} items · from ₱{{ section.from.toLocaleString('en-PH') }}
          </p>
        </div>
        <NuxtLink :to="`/${section.category.slug}`" class="text-sm font-semibold text-slate-500 transition hover:text-slate-900">
          See all {{ section.category.label.toLowerCase() }} →
        </NuxtLink>
      </div>

      <ul v-if="section.preview.length" class="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <li v-for="(product, index) in section.preview" :key="product.id" class="flex">
          <ProductCard :product="product" :priority="sectionIndex === 0 && index < 4" class="w-full" />
        </li>
      </ul>
      <EmptyState
        v-else
        :icon="section.category.icon"
        title="Nothing listed yet"
        :message="`We have not photographed the ${section.category.label.toLowerCase()} list yet — message us for what is on the tray today.`"
      />
    </section>
  </div>
</template>
