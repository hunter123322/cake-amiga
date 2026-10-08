<script setup lang="ts">
import type { FacetRef, SortKey } from '~/types/shop'
import { SORT_OPTIONS } from '~/composables/useCatalogView'

const props = defineProps<{
  q: string
  sort: SortKey
  maxPrice: number | null
  saved: boolean
  facets: Record<string, string>
  facetDefs: { def: FacetRef; options: { value: string; count: number }[] }[]
  pricePills: { value: number; label: string }[]
  total: number
  isFiltered: boolean
}>()

const emit = defineEmits<{
  'update:q': [string]
  'update:sort': [SortKey]
  'update:maxPrice': [number | null]
  'update:saved': [boolean]
  'update:facet': [field: string, value: string]
  reset: []
}>()

const search = ref(props.q)
watch(
  () => props.q,
  (value) => {
    if (value !== search.value) search.value = value
  },
)

let debounce: ReturnType<typeof setTimeout> | undefined
watch(search, (value) => {
  clearTimeout(debounce)
  debounce = setTimeout(() => {
    if (value !== props.q) emit('update:q', value)
  }, 220)
})
onBeforeUnmount(() => clearTimeout(debounce))

const hasFacets = computed(() => props.facetDefs.length > 0 || props.pricePills.length > 0)
</script>

<template>
  <section
    class="sticky top-14 z-20 -mx-4 border-y border-white/60 bg-white/75 px-4 py-2.5 backdrop-blur-xl lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none"
    aria-label="Filter and sort products"
  >
    <div class="flex items-center gap-2">
      <label class="relative flex-1">
        <span class="sr-only">Search {{ total }} items in this category</span>
        <UiIcon name="search" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model="search"
          type="search"
          placeholder="Search this category…"
          class="h-11 w-full rounded-2xl border-0 bg-white pl-9 pr-3 text-sm text-slate-900 ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/70"
        >
      </label>

      <label class="relative">
        <span class="sr-only">Sort by</span>
        <select
          :value="sort"
          class="h-11 appearance-none rounded-2xl border-0 bg-white pl-3.5 pr-9 text-sm font-medium text-slate-700 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/70"
          @change="emit('update:sort', ($event.target as HTMLSelectElement).value as SortKey)"
        >
          <option v-for="option in SORT_OPTIONS" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
        <UiIcon name="chevron-down" class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </label>

      <button
        type="button"
        class="flex h-11 shrink-0 items-center gap-1.5 rounded-2xl px-3 text-sm font-semibold transition active:scale-[0.97]"
        :class="saved ? 'bg-rose-500 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-rose-500'"
        :aria-pressed="saved"
        @click="emit('update:saved', !saved)"
      >
        <UiIcon name="heart" class="h-4 w-4" />
        <span class="hidden sm:inline">Saved</span>
      </button>
    </div>

    <div
      v-if="hasFacets"
      class="mt-2 flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <label v-for="facet in facetDefs" :key="facet.def.field" class="relative shrink-0">
        <span class="sr-only">{{ facet.def.label }}</span>
        <select
          :value="facets[facet.def.field] ?? ''"
          class="h-9 appearance-none rounded-full border-0 pl-3 pr-8 text-xs font-semibold ring-1 transition focus:outline-none focus:ring-2 focus:ring-slate-900/70"
          :class="facets[facet.def.field] ? 'bg-slate-900 text-white ring-slate-900' : 'bg-white text-slate-600 ring-slate-200'"
          @change="emit('update:facet', facet.def.field, ($event.target as HTMLSelectElement).value)"
        >
          <option value="">{{ facet.def.label }}: any</option>
          <option v-for="option in facet.options" :key="option.value" :value="option.value">
            {{ option.value }} ({{ option.count }})
          </option>
        </select>
        <UiIcon
          name="chevron-down"
          class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
          :class="facets[facet.def.field] ? 'text-white/80' : 'text-slate-400'"
        />
      </label>

      <button
        v-for="pill in pricePills"
        :key="pill.value"
        type="button"
        class="h-9 shrink-0 rounded-full px-3 text-xs font-semibold ring-1 transition active:scale-[0.97]"
        :class="maxPrice === pill.value ? 'bg-slate-900 text-white ring-slate-900' : 'bg-white text-slate-600 ring-slate-200'"
        :aria-pressed="maxPrice === pill.value"
        @click="emit('update:maxPrice', maxPrice === pill.value ? null : pill.value)"
      >{{ pill.label }}</button>

      <button
        v-if="isFiltered"
        type="button"
        class="flex h-9 shrink-0 items-center gap-1 rounded-full bg-amber-100 px-3 text-xs font-bold text-amber-800 transition active:scale-[0.97]"
        @click="emit('reset')"
      >
        <UiIcon name="close" class="h-3.5 w-3.5" />
        Clear filters
      </button>
    </div>
  </section>
</template>
