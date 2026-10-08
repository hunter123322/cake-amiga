import type { Coffee, BrewType, ProductBadge, Strength } from '~/types/shop'
import { createdDaysAgo, roundSizes, slugify, HOT_CUP_SIZE_STEPS } from './helpers'
import { IMAGE_LIBRARY } from './imageLibrary'

const COFFEE_PHOTOS = IMAGE_LIBRARY.coffee ?? []

let coffeeIndex = 0

function coffee(
  name: string,
  base: number,
  brewType: BrewType,
  strength: Strength,
  description: string,
  options: { badges?: ProductBadge[]; featured?: boolean } = {},
): Coffee {
  const sizes = roundSizes(base, HOT_CUP_SIZE_STEPS)
  const index = coffeeIndex++
  const photo = COFFEE_PHOTOS[index]
  return {
    id: `coffee-${String(index + 1).padStart(2, '0')}`,
    slug: slugify(name),
    name,
    description,
    category: 'coffee',
    priceFrom: Math.min(...sizes.map((s) => s.price)),
    images: photo ? [photo] : [],
    badges: options.badges,
    leadTime: '8 min',
    featured: options.featured ?? false,
    active: true,
    createdAt: createdDaysAgo(index),
    brewType,
    strength,
    sizes,
  }
}

export const COFFEES: Coffee[] = [
  coffee('Espresso', 95, 'hot', 'single', 'A 30 ml double-pull of Bicol arabica with a thick crema and a cocoa finish. Drink it standing up.', { featured: true }),
  coffee('Americano', 105, 'hot', 'double', 'Espresso stretched with hot water — all the flavour of the shot, none of the milk.', { featured: true }),
  coffee('Cappuccino', 125, 'hot', 'double', 'Equal parts espresso, steamed milk and foam, dusted with cocoa. Served in a warm cup.', { featured: true, badges: ['bestseller'] }),
  coffee('Café Latte', 125, 'hot', 'double', 'Silky steamed milk with a single espresso underneath and a thin layer of microfoam on top.', { featured: true }),
  coffee('Spanish Latte', 135, 'iced', 'double', 'Condensed milk and espresso over ice — sweet, strong and the best seller after eleven in the morning.', { badges: ['bestseller'], featured: true }),
  coffee('Coffee Frappé', 155, 'frappe', 'double', 'Espresso, milk and ice blended until thick, finished with whipped cream.', { badges: ['bestseller'], featured: true }),
  coffee('Mocha Frappé', 165, 'frappe', 'double', 'Chocolate and espresso blended with ice, cream on top and cocoa dusted over.', { featured: true }),
  coffee('Iced Americano', 115, 'iced', 'triple', 'Three shots over ice and cold water. Order it if you have work to finish.', { badges: ['new'] }),
  coffee('Caramel Macchiato', 145, 'iced', 'double', 'Vanilla syrup, milk, espresso and a caramel drizzle that sinks through the ice.', { featured: true }),
]
