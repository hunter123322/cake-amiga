import type { ShopInfo } from '~/types/shop'

/**
 * Single source of truth for store details used by the public layout footer,
 * the contact page and the LocalBusiness JSON-LD.
 *
 * The Messenger handle, Viber link and social profiles are still placeholders
 * and must be replaced with the real ones before launch.
 */
export const SHOP_INFO: ShopInfo = {
  name: 'Cake Amiga',
  legalName: 'Cake Amiga & Café',
  tagline: 'Cakes, donuts and brews baked fresh in Bacacay, Albay.',
  address: {
    street: 'Barrameda St., Barangay 5',
    city: 'Bacacay',
    province: 'Albay',
    country: 'Philippines',
  },
  geo: { lat: 13.293989, lng: 123.79202 },
  mapLink: 'https://www.google.com/maps/search/?api=1&query=13.293989%2C123.79202',
  hours: [
    { days: 'Monday – Friday', open: '7:00 AM – 8:00 PM' },
    { days: 'Saturday', open: '7:00 AM – 9:00 PM' },
    { days: 'Sunday', open: '8:00 AM – 6:00 PM' },
  ],
  periods: [
    { days: [1, 2, 3, 4, 5], open: '07:00', close: '20:00' },
    { days: [6], open: '07:00', close: '21:00' },
  ],
  rating: {
    stars: 5,
    count: 5,
    source: 'Google Map',
    url: 'https://maps.app.goo.gl/KXn7q24YY6P2E48x8',
    recentNote: 'Marissa Barrameda: Highly recommend Cake Amiga,proven and tested, Also their products have high Quality.'
},
  phone: '+639082678874',
  phoneDisplay: '0908 267 8874',
  messenger: 'https://m.me/cakeamiga',
  viber: 'viber://chat?number=%2B639082678874',
  email: 'cakeamiga27@gmail.com',
  socials: [
    { label: 'Facebook', url: 'https://www.facebook.com/cakeamiga' },
    { label: 'Instagram', url: 'https://www.instagram.com/cakeamiga' },
  ],
  pickupNote: 'Pickup in Bacacay, Albay. Ready when you arrive.',
  deliveryNote: 'Delivery within 30 km of Bacacay (Legazpi, Malinao, Sto. Domingo)',
}

export const SHOP_ADDRESS_LINE = `${SHOP_INFO.address.street}, ${SHOP_INFO.address.city}, ${SHOP_INFO.address.province}, ${SHOP_INFO.address.country}`
