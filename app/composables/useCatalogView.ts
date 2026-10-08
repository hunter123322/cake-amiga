import type { CategoryMeta, CatalogFilters, CategorySlug, FacetRef, ShopProduct, SortKey } from '~/types/shop'
import { CATEGORY_BY_SLUG } from '~/data/shop/categories'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name (A–Z)' },
]

const PAGE_FILTER_KEYS = ['q', 'sort', 'maxPrice', 'facets', 'saved', 'page'] as const

/**
 * Filtering, sorting and URL state for one category page. The active filter set
 * is what makes a page shareable, so it round-trips through the query string.
 */
export function useCatalogView(category: Ref<CategorySlug> | ComputedRef<CategorySlug>) {
  const store = useCatalogStore()
  const route = useRoute()
  const router = useRouter()
  const meta = computed<CategoryMeta>(() => CATEGORY_BY_SLUG[category.value])
  const writing = ref(false)

  const filters = computed(() => store.filters)
  const results = computed<ShopProduct[]>(() => store.select(category.value))
  const items = computed<ShopProduct[]>(() => store.visible(results.value))
  const total = computed(() => results.value.length)
  const hasMore = computed(() => items.value.length < total.value)
  const isFiltered = computed(
    () =>
      filters.value.q.trim() !== '' ||
      filters.value.maxPrice !== null ||
      filters.value.saved ||
      Object.keys(filters.value.facets).length > 0,
  )

  const facets = computed<{ def: FacetRef; options: { value: string; count: number }[] }[]>(() =>
    meta.value.facets
      .map((def) => ({ def, options: store.facetOptions(category.value, def.field) }))
      .filter((facet) => facet.options.length > 1),
  )

  const pricePills = computed(() => {
    const steps = meta.value.priceSteps
    const top = Math.max(...store.byCategory(category.value).map((p) => p.priceFrom), 0)
    const unique = [...new Set(steps.filter((step) => step <= top))]
    return unique.map((value) => ({ value, label: `Under ₱${value.toLocaleString('en-PH')}` }))
  })

  function toQuery(state: CatalogFilters): Record<string, string> {
    const query: Record<string, string> = {}
    if (state.q.trim()) query.q = state.q.trim()
    if (state.sort !== 'featured') query.sort = state.sort
    if (state.maxPrice !== null) query.max = String(state.maxPrice)
    if (state.saved) query.saved = '1'
    if (state.page > 1) query.page = String(state.page)
    for (const [field, value] of Object.entries(state.facets)) if (value) query[field] = value
    return query
  }

  function applyQuery(query: Record<string, unknown>) {
    const next = defaultFiltersForQuery(query)
    const current = JSON.stringify(toQuery(store.filters))
    const incoming = JSON.stringify(toQuery(next))
    if (current === incoming) return
    store.filters = next
  }

  function defaultFiltersForQuery(query: Record<string, unknown>): CatalogFilters {
    const facets: Record<string, string> = {}
    for (const def of meta.value.facets) {
      const raw = query[def.field]
      if (typeof raw === 'string' && raw) facets[def.field] = raw
    }
    const sort = typeof query.sort === 'string' && SORT_OPTIONS.some((o) => o.value === query.sort) ? (query.sort as SortKey) : 'featured'
    const max = typeof query.max === 'string' ? Number(query.max) : null
    const page = typeof query.page === 'string' ? Math.max(1, Number(page0(query.page))) : 1
    return {
      q: typeof query.q === 'string' ? query.q : '',
      sort,
      maxPrice: max !== null && Number.isFinite(max) ? max : null,
      facets,
      saved: query.saved === '1',
      page: Number.isFinite(page) ? page : 1,
    }
  }

  function page0(value: string): number {
    const n = Number(value)
    return Number.isFinite(n) ? n : 1
  }

  // Applied during setup, not onMounted, so the server renders the list the URL asks for:
  // `?page=2` (and every filter link) is then real content for crawlers, not a client-only view.
  applyQuery({ ...route.query, saved: undefined })

  onMounted(() => {
    store.hydrate()
    applyQuery(route.query as Record<string, unknown>)
  })

  watch(
    () => route.query,
    (query) => {
      if (writing.value) return
      applyQuery(query as Record<string, unknown>)
    },
  )

  watch(
    () => filters.value,
    (state) => {
      writing.value = true
      router.replace({ query: toQuery(state) }).finally(() => {
        writing.value = false
      })
    },
    { deep: true },
  )

  // Reset paging whenever the category changes under the same component.
  watch(category, () => {
    store.resetFilters()
  })

  function search(value: string) {
    store.setFilter('q', value)
  }

  function setMaxPrice(value: number | null) {
    store.setFilter('maxPrice', value)
  }

  function setSort(value: SortKey) {
    store.setFilter('sort', value)
  }

  function setFacet(field: string, value: string) {
    store.setFacet(field, value)
  }

  function toggleSaved() {
    store.setFilter('saved', !filters.value.saved)
  }

  function resetAll() {
    store.resetFilters()
  }

  function related(product: ShopProduct, limit = 4): ShopProduct[] {
    return store
      .byCategory(product.category)
      .filter((candidate) => candidate.id !== product.id && candidate.active)
      .sort((a, b) => score(b, product) - score(a, product) || a.name.localeCompare(b.name))
      .slice(0, limit)
  }

  function score(candidate: ShopProduct, product: ShopProduct): number {
    const sharedBadges = (candidate.badges ?? []).filter((badge) => (product.badges ?? []).includes(badge)).length
    const priceGap = Math.abs(candidate.priceFrom - product.priceFrom)
    return (candidate.featured ? 2 : 0) + sharedBadges * 3 - priceGap / 1000
  }

  return {
    meta,
    filters,
    results,
    items,
    total,
    hasMore,
    isFiltered,
    facets,
    pricePills,
    search,
    setMaxPrice,
    setSort,
    setFacet,
    toggleSaved,
    resetAll,
    related,
    filterKeys: PAGE_FILTER_KEYS,
  }
}
