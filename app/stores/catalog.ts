import { defineStore } from 'pinia'
import { ALL_SEED_PRODUCTS, seedFor } from '~/data/shop'
import type { CatalogFilters, CategorySlug, ShopProduct, SortKey } from '~/types/shop'

const FAVORITES_KEY = 'cake-amiga-favorites-v1'

const PAGE_SIZE = 12

export function defaultFilters(): CatalogFilters {
  return { q: '', sort: 'featured', maxPrice: null, facets: {}, saved: false, page: 1 }
}

/**
 * The catalogue itself is hardcoded in `app/data/shop` — this store only holds
 * the visitor's own state: what they searched for and what they saved.
 */
export const useCatalogStore = defineStore('catalog', () => {
  const favorites = ref<string[]>([])
  const filters = ref<CatalogFilters>(defaultFilters())
  const hydrated = ref(false)

  function readFavorites(): string[] {
    if (!import.meta.client) return []
    try {
      const raw = window.localStorage.getItem(FAVORITES_KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  }

  /** Favourites are the only state we keep, so a failure here is harmless. */
  function hydrate() {
    if (!import.meta.client || hydrated.value) return
    favorites.value = readFavorites()
    hydrated.value = true
  }

  if (import.meta.client) {
    watch(
      favorites,
      (value) => {
        // Skip the boot-time replacement, which would write the empty SSR payload back.
        if (!hydrated.value) return
        try {
          window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(value))
        } catch {
          /* private mode or quota — saving just does not stick */
        }
      },
      { deep: true },
    )
  }

  const products = computed<ShopProduct[]>(() => ALL_SEED_PRODUCTS)

  function byCategory(category: CategorySlug): ShopProduct[] {
    return seedFor(category)
  }

  function count(category: CategorySlug): number {
    return byCategory(category).length
  }

  function findBySlug(category: CategorySlug, slug: string): ShopProduct | undefined {
    return byCategory(category).find((product) => product.slug === slug)
  }

  function findById(id: string): ShopProduct | undefined {
    return products.value.find((product) => product.id === id)
  }

  function isFavorite(id: string): boolean {
    return favorites.value.includes(id)
  }

  function toggleFavorite(id: string) {
    favorites.value = isFavorite(id) ? favorites.value.filter((f) => f !== id) : [...favorites.value, id]
  }

  function setFilter<K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) {
    filters.value = { ...filters.value, [key]: value, page: key === 'page' ? (value as number) : 1 }
  }

  function setFacet(field: string, value: string) {
    const facets = { ...filters.value.facets }
    if (value) facets[field] = value
    else delete facets[field]
    filters.value = { ...filters.value, facets, page: 1 }
  }

  function resetFilters() {
    filters.value = defaultFilters()
  }

  function sortProducts(list: ShopProduct[], sort: SortKey): ShopProduct[] {
    const sorted = [...list]
    switch (sort) {
      case 'newest':
        return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      case 'price-asc':
        return sorted.sort((a, b) => a.priceFrom - b.priceFrom)
      case 'price-desc':
        return sorted.sort((a, b) => b.priceFrom - a.priceFrom)
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'featured':
      default:
        return sorted.sort((a, b) => {
          if (a.featured !== b.featured) return a.featured ? -1 : 1
          return b.createdAt.localeCompare(a.createdAt)
        })
    }
  }

  /** Distinct values for a facet field across a category, most common first. */
  function facetOptions(category: CategorySlug, field: string): { value: string; count: number }[] {
    const counts = new Map<string, number>()
    for (const product of byCategory(category)) {
      const raw = (product as unknown as Record<string, unknown>)[field]
      const values: string[] = Array.isArray(raw)
        ? raw.map(String)
        : typeof raw === 'string'
          ? [raw]
          : []
      if (field === 'sizes') {
        const sizes = (product as unknown as { sizes?: { label: string }[] }).sizes ?? []
        values.splice(0, values.length, ...sizes.map((s) => s.label))
      }
      for (const value of new Set(values)) counts.set(value, (counts.get(value) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
  }

  function select(category: CategorySlug): ShopProduct[] {
    const { q, sort, maxPrice, facets, saved } = filters.value
    const needle = q.trim().toLowerCase()
    let list = byCategory(category).filter((product) => product.active)

    if (maxPrice !== null) list = list.filter((product) => product.priceFrom <= maxPrice)
    if (saved) list = list.filter((product) => isFavorite(product.id))

    for (const [field, value] of Object.entries(facets)) {
      if (!value) continue
      list = list.filter((product) => {
        const raw = (product as unknown as Record<string, unknown>)[field]
        if (field === 'sizes') {
          const sizes = (product as unknown as { sizes?: { label: string }[] }).sizes ?? []
          return sizes.some((s) => s.label === value)
        }
        if (Array.isArray(raw)) return raw.map(String).includes(value)
        return String(raw) === value
      })
    }

    if (needle) {
      list = list.filter((product) =>
        [product.name, product.description, ...(product.badges ?? [])].join(' ').toLowerCase().includes(needle),
      )
    }

    return sortProducts(list, sort)
  }

  function visible(list: ShopProduct[]): ShopProduct[] {
    return list.slice(0, filters.value.page * PAGE_SIZE)
  }

  return {
    favorites,
    filters,
    hydrated,
    products,
    pageSize: PAGE_SIZE,
    hydrate,
    byCategory,
    count,
    findBySlug,
    findById,
    isFavorite,
    toggleFavorite,
    setFilter,
    setFacet,
    resetFilters,
    facetOptions,
    select,
    visible,
    sortProducts,
  }
})
