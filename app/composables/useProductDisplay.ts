import type { ProductBadge, ShopProduct } from '~/types/shop'

export const BADGE_LABELS: Record<ProductBadge, string> = {
  bestseller: 'Bestseller',
  new: 'New',
  limited: 'Limited',
  seasonal: 'In season',
}

export const BADGE_CLASSES: Record<ProductBadge, string> = {
  bestseller: 'bg-amber-500 text-white',
  new: 'bg-emerald-500 text-white',
  limited: 'bg-rose-500 text-white',
  seasonal: 'bg-sky-500 text-white',
}

export function useProductDisplay() {
  const peso = (value: number) => `₱${value.toLocaleString('en-PH')}`

  function priceFromLabel(product: ShopProduct): string {
    if (product.category === 'donuts') return `${peso(product.priceFrom)} each`
    return `From ${peso(product.priceFrom)}`
  }

  /** The one line under the name that tells you what you are looking at. */
  function summaryLine(product: ShopProduct): string {
    switch (product.category) {
      case 'cakes': {
        const flavors = product.flavors.slice(0, 2).join(' · ')
        return `${product.sizes.length} sizes · ${flavors}`
      }
      case 'drinks':
        return `${product.sizes.map((s) => s.label).join(' · ')}`
      case 'coffee':
        return `${product.brewType} · ${product.strength} shot`
      case 'donuts': {
        const parts = [product.glaze ? `${product.glaze} glaze` : null, product.filling ? `${product.filling} filled` : null]
        return parts.filter(Boolean).join(' · ') || 'Sugar rolled'
      }
      case 'bread':
        return product.packSizes.map((p) => p.label).join(' · ')
      default:
        return ''
    }
  }

  /** Up to three chips for cards and the detail header. */
  function chips(product: ShopProduct): string[] {
    switch (product.category) {
      case 'cakes':
        return [...product.occasion.slice(0, 2), ...product.flavors.slice(0, 1)]
      case 'drinks':
        return [product.drinkType.replace('-', ' '), ...(product.sweetnessLevels ? ['sweetness choice'] : [])]
      case 'coffee':
        return [product.brewType, `${product.strength} shot`]
      case 'donuts':
        return [product.glaze ?? 'Sugar', ...(product.filling ? [product.filling] : [])]
      case 'bread':
        return [product.breadType, ...(product.weight ? [product.weight] : [])]
      default:
        return []
    }
  }

  /** Rows for the detail view's variant table. */
  function variantRows(product: ShopProduct): { label: string; detail: string; price: string }[] {
    if (product.category === 'donuts') {
      return product.boxSizes.map((box) => ({
        label: box.count === 1 ? 'Single' : `Box of ${box.count}`,
        detail: box.count === 1 ? 'One piece' : `${box.count} pieces, boxed`,
        price: peso(box.price),
      }))
    }
    if (product.category === 'bread') {
      return product.packSizes.map((pack) => ({ label: pack.label, detail: product.weight ?? 'Baked fresh daily', price: peso(pack.price) }))
    }
    return product.sizes.map((size) => ({
      label: size.label,
      detail: size.servings ? `Serves ${size.servings}` : size.ml ? `${size.ml} ml` : 'Cup size',
      price: peso(size.price),
    }))
  }

  return { peso, priceFromLabel, summaryLine, chips, variantRows, badgeLabel: BADGE_LABELS, badgeClass: BADGE_CLASSES }
}
