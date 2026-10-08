export const CATEGORY_SLUGS = ['cakes', 'drinks', 'coffee', 'donuts', 'bread'] as const

export type CategorySlug = (typeof CATEGORY_SLUGS)[number]

export type ProductBadge = 'bestseller' | 'new' | 'limited' | 'seasonal'

export type DrinkType = 'milk-tea' | 'fruit' | 'soda' | 'juice' | 'shake'
export type BrewType = 'hot' | 'iced' | 'frappe'
export type Strength = 'single' | 'double' | 'triple'
export type BreadType = 'loaf' | 'bun' | 'sweet' | 'savory'

export interface SizeOption {
  label: string
  price: number
  servings?: number
  ml?: number
}

export interface BaseProduct {
  id: string
  slug: string
  name: string
  description: string
  priceFrom: number
  images: string[]
  badges?: ProductBadge[]
  leadTime: string
  featured: boolean
  active: boolean
  createdAt: string
}

export interface Cake extends BaseProduct {
  category: 'cakes'
  occasion: string[]
  flavors: string[]
  sizes: SizeOption[]
}

export interface Drink extends BaseProduct {
  category: 'drinks'
  drinkType: DrinkType
  sizes: SizeOption[]
  sweetnessLevels?: string[]
}

export interface Coffee extends BaseProduct {
  category: 'coffee'
  brewType: BrewType
  strength: Strength
  sizes: SizeOption[]
}

export interface Donut extends BaseProduct {
  category: 'donuts'
  filling?: string
  glaze?: string
  boxSizes: { count: number; price: number }[]
}

export interface Bread extends BaseProduct {
  category: 'bread'
  breadType: BreadType
  weight?: string
  packSizes: { label: string; price: number }[]
}

export type ShopProduct = Cake | Drink | Coffee | Donut | Bread

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name'

export interface FacetRef {
  /** field on the product that the facet reads */
  field: 'occasion' | 'flavors' | 'sizes' | 'drinkType' | 'brewType' | 'strength' | 'filling' | 'glaze' | 'breadType'
  label: string
}

export interface CategoryMeta {
  slug: CategorySlug
  label: string
  icon: string
  h1: string
  tagline: string
  intro: string
  cover?: string
  seoTitle: string
  seoDescription: string
  /** facets offered by the filter toolbar for this category */
  facets: FacetRef[]
  /** price buckets shown as pills, in pesos */
  priceSteps: number[]
  /** short lead-time phrase for the compact hero meta row */
  leadNote: string
  /** whether the page cross-sells the cake builder */
  linksBuilder?: boolean
  /** what "order" means for this category */
  orderNote: string
}

export interface ShopHoursPeriod {
  /** JS weekday numbers: 0 = Sunday … 6 = Saturday */
  days: number[]
  /** 24-hour "HH:MM" */
  open: string
  close: string
}

export interface ShopRating {
  stars: number
  count: number
  source: string
  url: string
  /** e.g. "12 new this month" — only fill in if you track it */
  recentNote?: string
}

export interface ShopInfo {
  name: string
  legalName: string
  tagline: string
  address: { street: string; city: string; province: string; country: string }
  geo: { lat: number; lng: number }
  mapLink: string
  hours: { days: string; open: string }[]
  /** Machine-readable hours, used for the “open now” indicator. */
  periods: ShopHoursPeriod[]
  /** Left null until real Google numbers exist — the UI hides the row when it is null. */
  rating: ShopRating | null
  phone: string
  phoneDisplay: string
  messenger: string
  viber: string
  email: string
  socials: { label: string; url: string }[]
  pickupNote: string
  deliveryNote: string
}

export interface CatalogFilters {
  q: string
  sort: SortKey
  maxPrice: number | null
  facets: Record<string, string>
  saved: boolean
  page: number
}
