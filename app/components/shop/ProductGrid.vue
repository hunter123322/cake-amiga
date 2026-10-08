<script setup lang="ts">
import type { CategorySlug, ShopProduct } from '~/types/shop'

const props = defineProps<{
  items: ShopProduct[]
  total: number
  hasMore: boolean
  category: CategorySlug
  isFiltered: boolean
}>()

const emit = defineEmits<{ 'load-more': []; reset: [] }>()

/** Only the first row is above the fold, so only the first four images load eagerly. */
const EAGER = 4
</script>

<template>
  <div class="flex flex-col gap-6">
    <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400" role="status">
      Showing {{ items.length }} of {{ total }} {{ total === 1 ? 'item' : 'items' }}
    </p>

    <div v-if="items.length" class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      <ProductCard
        v-for="(product, index) in items"
        :key="product.id"
        :product="product"
        :priority="index < EAGER && !isFiltered"
      />
    </div>

    <EmptyState
      v-else
      :icon="isFiltered ? 'search' : 'cake'"
      :title="isFiltered ? 'No matches in this category' : 'New items are on the way'"
      :message="
        isFiltered
          ? 'Nothing matched those filters. Try a different flavour, a wider price range, or clear the filters.'
          : 'We are still photographing this part of the menu. Message us and we will tell you what is available today.'
      "
      :action-label="isFiltered ? 'Clear filters' : ''"
      @action="emit('reset')"
    />

    <button
      v-if="hasMore"
      type="button"
      class="mx-auto h-12 rounded-full bg-white px-6 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition active:scale-[0.98] hover:text-slate-900 hover:ring-slate-300"
      @click="emit('load-more')"
    >
      Load {{ Math.min(total - items.length, 12) }} more
    </button>
  </div>
</template>
