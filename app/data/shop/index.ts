import type { CategorySlug, ShopProduct } from '~/types/shop'
import { CATEGORIES } from './categories'
import { CAKES } from './cakes'
import { DRINKS } from './drinks'
import { COFFEES } from './coffee'
import { DONUTS } from './donuts'
import { BREADS } from './bread'

/** Hard cap per category. The catalogue is hardcoded, so this is a guard rail. */
export const CATEGORY_CAP = 50

export const SEED_PRODUCTS: Record<CategorySlug, ShopProduct[]> = {
  cakes: CAKES,
  drinks: DRINKS,
  coffee: COFFEES,
  donuts: DONUTS,
  bread: BREADS,
}

export const ALL_SEED_PRODUCTS: ShopProduct[] = Object.values(SEED_PRODUCTS).flat()

export function seedFor(category: CategorySlug): ShopProduct[] {
  return SEED_PRODUCTS[category] ?? []
}

if (import.meta.dev) {
  for (const category of CATEGORIES) {
    const total = seedFor(category.slug).length
    if (total > CATEGORY_CAP) {
      console.warn(`[catalogue] ${category.label} has ${total} items — the cap is ${CATEGORY_CAP}.`)
    }
  }
}
