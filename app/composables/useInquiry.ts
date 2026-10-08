import type { ShopProduct } from '~/types/shop'
import { SHOP_INFO } from '~/data/shop/info'

/**
 * PH buying behaviour: an order is a message, not a checkout. Every CTA on the
 * shop pages resolves to a prefilled Messenger, Viber or phone link.
 */
export function useInquiry() {
  function priceLine(product: ShopProduct, sizeLabel?: string): string {
    const size = sizeLabel ? ` (${sizeLabel})` : ''
    return `₱${product.priceFrom.toLocaleString('en-PH')}${size}`
  }

  function orderMessage(product?: ShopProduct, sizeLabel?: string): string {
    if (!product) return `Hi ${SHOP_INFO.name}! I would like to place an order.`
    return [
      `Hi ${SHOP_INFO.name}! I would like to order:`,
      `• ${product.name} — ${priceLine(product, sizeLabel)}`,
      'Pickup or delivery: ',
      'Preferred date and time: ',
    ].join('\n')
  }

  function messengerLink(product?: ShopProduct, sizeLabel?: string): string {
    const slug = SHOP_INFO.messenger.replace(/\/$/, '')
    return `${slug}?text=${encodeURIComponent(orderMessage(product, sizeLabel))}`
  }

  function viberLink(product?: ShopProduct, sizeLabel?: string): string {
    const separator = SHOP_INFO.viber.includes('?') ? '&' : '?'
    return `${SHOP_INFO.viber}${separator}text=${encodeURIComponent(orderMessage(product, sizeLabel))}`
  }

  function callLink(): string {
    return `tel:${SHOP_INFO.phone}`
  }

  async function shareProduct(product: ShopProduct, url: string): Promise<'shared' | 'copied' | 'failed'> {
    if (typeof navigator === 'undefined') return 'failed'
    const payload = {
      title: `${product.name} — ${SHOP_INFO.name}`,
      text: product.description,
      url,
    }
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> }
    try {
      if (typeof nav.share === 'function') {
        await nav.share(payload)
        return 'shared'
      }
      await nav.clipboard.writeText(url)
      return 'copied'
    } catch {
      return 'failed'
    }
  }

  /** Cheap, dependency-free event tracking; wire to GA/Plausible by pushing to dataLayer. */
  function track(event: 'view_card' | 'click_card' | 'click_order' | 'view_product', payload: Record<string, unknown>) {
    if (!import.meta.client) return
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] }
    w.dataLayer = w.dataLayer ?? []
    w.dataLayer.push({ event, ...payload })
  }

  return { orderMessage, messengerLink, viberLink, callLink, shareProduct, priceLine, track }
}
