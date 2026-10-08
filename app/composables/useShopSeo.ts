import type { ShopProduct } from '~/types/shop'
import { SHOP_INFO, SHOP_ADDRESS_LINE } from '~/data/shop/info'

export interface SeoInput {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article' | 'product'
  /** Overrides the default `index, follow` behaviour in the rendered `meta[name=robots]`. */
  robots?: string
  jsonLd?: Record<string, unknown>[]
}

/** Pages with no photography of their own still need a social preview. */
export const DEFAULT_SOCIAL_IMAGE = '/img/cake/red_rose_bdayCake.webp'

export function useSiteUrl(): string {
  if (import.meta.client) return window.location.origin
  try {
    return useRequestURL().origin
  } catch {
    return ''
  }
}

export function useShopSeo(input: SeoInput) {
  const origin = useSiteUrl()
  const canonical = `${origin}${input.path}`
  const image = `${origin}${input.image ?? DEFAULT_SOCIAL_IMAGE}`
  // og:type has no product value; Open Graph only distinguishes website/article here.
  const ogType = input.type === 'article' ? 'article' : 'website'

  useSeoMeta({
    title: input.title,
    description: input.description,
    ogTitle: input.title,
    ogDescription: input.description,
    ogType,
    ogUrl: canonical,
    ogSiteName: SHOP_INFO.name,
    ogLocale: 'en_PH',
    ogImage: image,
    ogImageWidth: 1086,
    ogImageHeight: 1357,
    twitterCard: 'summary_large_image',
    twitterTitle: input.title,
    twitterDescription: input.description,
    twitterImage: image,
    ...(input.robots ? { robots: input.robots } : {}),
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    script: (input.jsonLd ?? []).map((data) => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(data),
    })),
  })

  return { canonical, origin }
}

export function localBusinessJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: SHOP_INFO.legalName,
    description: SHOP_INFO.tagline,
    image: `${useSiteUrl()}/img/cake/red_rose_bdayCake.webp`,
    telephone: SHOP_INFO.phoneDisplay,
    email: SHOP_INFO.email,
    priceRange: '₱₱',
    currenciesAccepted: 'PHP',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SHOP_INFO.address.street,
      addressLocality: SHOP_INFO.address.city,
      addressRegion: SHOP_INFO.address.province,
      addressCountry: 'PH',
    },
    geo: { '@type': 'GeoCoordinates', latitude: SHOP_INFO.geo.lat, longitude: SHOP_INFO.geo.lng },
    hasMap: SHOP_INFO.mapLink,
    openingHours: SHOP_INFO.hours.map((entry) => `${entry.days} ${entry.open}`),
    sameAs: SHOP_INFO.socials.map((social) => social.url),
    servesCuisine: ['Cakes', 'Coffee', 'Donuts', 'Drinks'],
  }
}

export function productJsonLd(product: ShopProduct, url: string, origin = ''): Record<string, unknown> {
  const image = product.images.length > 0 ? `${origin}${product.images[0]}` : undefined
  const availability = 'https://schema.org/InStock'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    ...(image ? { image: [image] } : {}),
    category: product.category,
    brand: { '@type': 'Brand', name: SHOP_INFO.name },
    url,
    ...(product.badges?.length ? { keywords: product.badges.join(', ') } : {}),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'PHP',
      lowPrice: product.priceFrom,
      offerCount: offerCount(product),
      availability,
      seller: { '@type': 'Organization', name: SHOP_INFO.name, address: SHOP_ADDRESS_LINE },
    },
  }
}

function offerCount(product: ShopProduct): number {
  if (product.category === 'donuts') return product.boxSizes.length
  return product.sizes.length
}

export function breadcrumbJsonLd(trail: { name: string; url: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
