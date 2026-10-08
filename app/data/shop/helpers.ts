import type { SizeOption } from '~/types/shop'

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/["']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Prices are quoted in whole pesos; nothing in the shop costs ₱x.50. */
export function pesos(value: number): number {
  return Math.round(value / 5) * 5
}

/** Newest-first ordering for the "Newest" sort, staggered so it looks natural. */
export function createdDaysAgo(index: number): string {
  const days = index * 3
  return new Date(Date.UTC(2026, 8, 30) - days * 86_400_000).toISOString().slice(0, 10)
}

export function roundSizes(base: number, steps: { label: string; factor: number; servings?: number; ml?: number }[]): SizeOption[] {
  return steps.map((step) => ({
    label: step.label,
    price: pesos(base * step.factor),
    ...(step.servings === undefined ? {} : { servings: step.servings }),
    ...(step.ml === undefined ? {} : { ml: step.ml }),
  }))
}

export const CAKE_SIZE_STEPS = [
  { label: '6" round', factor: 1, servings: 8 },
  { label: '8" round', factor: 1.5, servings: 14 },
  { label: '10" round', factor: 2.1, servings: 24 },
]

export const CUP_SIZE_STEPS = [
  { label: '16 oz', factor: 1, ml: 473 },
  { label: '22 oz', factor: 1.3, ml: 650 },
]

export const HOT_CUP_SIZE_STEPS = [
  { label: '8 oz hot', factor: 1, ml: 237 },
  { label: '12 oz', factor: 1.25, ml: 355 },
  { label: '16 oz iced', factor: 1.45, ml: 473 },
]
