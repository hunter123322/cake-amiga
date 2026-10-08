import type { ShopInfo } from '~/types/shop'

/**
 * Single source of truth for store details used by the public layout footer,
 * the contact page and the LocalBusiness JSON-LD.
 *
 * Placeholders (phone, Messenger, Viber, e-mail) must be replaced with the real
 * details before launch — they are intentionally non-routable values.
 */
export const SHOP_INFO: ShopInfo = {
  name: 'Cake Amiga',
  legalName: 'Cake Amiga & Café',
  tagline: 'Cakes, bread and brews baked fresh in Bacacay, Albay.',
  address: {
    street: 'Poblacion, along the Bacacay–Legazpi road',
    city: 'Bacacay',
    province: 'Albay',
    country: 'Philippines',
  },
  geo: { lat: 13.2925, lng: 123.7909 },
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Bacacay%2C%20Albay',
  hours: [
    { days: 'Monday – Friday', open: '7:00 AM – 8:00 PM' },
    { days: 'Saturday', open: '7:00 AM – 9:00 PM' },
    { days: 'Sunday', open: '8:00 AM – 6:00 PM' },
  ],
  periods: [
    { days: [1, 2, 3, 4, 5], open: '07:00', close: '20:00' },
    { days: [6], open: '07:00', close: '21:00' },
    { days: [0], open: '08:00', close: '18:00' },
  ],
  // Paste the real Google Business Profile numbers here to switch the rating row on.
  // It stays hidden until then — nothing invented is ever shown to customers.
  rating: null,
  phone: '+639000000000',
  phoneDisplay: '+63 900 000 0000',
  messenger: 'https://m.me/cakeamiga',
  viber: 'viber://chat?number=%2B639000000000',
  email: 'hello@cakeamiga.ph',
  socials: [
    { label: 'Facebook', url: 'https://www.facebook.com/cakeamiga' },
    { label: 'Instagram', url: 'https://www.instagram.com/cakeamiga' },
  ],
  pickupNote: 'Pickup in Bacacay, Albay — ready when you arrive.',
  deliveryNote: 'Delivery within 10 km of Bacacay (Legazpi, Malinao, Sto. Domingo) from ₱80.',
}

export const SHOP_ADDRESS_LINE = `${SHOP_INFO.address.street}, ${SHOP_INFO.address.city}, ${SHOP_INFO.address.province}, ${SHOP_INFO.address.country}`
