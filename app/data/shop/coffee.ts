import type { Coffee, BrewType, ProductBadge, Strength } from '~/types/shop'
import { createdDaysAgo, roundSizes, slugify, HOT_CUP_SIZE_STEPS } from './helpers'

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
  return {
    id: `coffee-${String(coffeeIndex + 1).padStart(2, '0')}`,
    slug: slugify(name),
    name,
    description,
    category: 'coffee',
    priceFrom: Math.min(...sizes.map((s) => s.price)),
    // No coffee photography exists yet — these render the "photo coming soon" tile.
    images: [],
    badges: options.badges,
    leadTime: '8 min',
    featured: options.featured ?? false,
    active: true,
    createdAt: createdDaysAgo(coffeeIndex++),
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
  coffee('Bicol Liberica Pour-over', 145, 'hot', 'single', 'Single-origin liberica from Camarines, brewed by hand. Smoky, woody and unlike any arabica.', { badges: ['limited'], featured: true }),
  coffee('Spanish Latte', 135, 'iced', 'double', 'Condensed milk and espresso over ice — sweet, strong and the best seller after eleven in the morning.', { badges: ['bestseller'], featured: true }),
  coffee('Iced Americano', 115, 'iced', 'triple', 'Three shots over ice and cold water. Order it if you have work to finish.', { badges: ['new'] }),
  coffee('Cold Brew 18h', 145, 'iced', 'triple', 'Steeped for eighteen hours, strained and served over a single large cube. Low acid, high caffeine.', { featured: true }),
  coffee('Caramel Macchiato', 145, 'iced', 'double', 'Vanilla syrup, milk, espresso and a caramel drizzle that sinks through the ice.', { featured: true }),
  coffee('Vietnamese Iced Coffee', 135, 'iced', 'triple', 'Phin-brewed dark roast with condensed milk, stirred at the table until it goes the colour of toffee.' ),
  coffee('Coffee Frappé', 155, 'frappe', 'double', 'Espresso, milk and ice blended until thick, finished with whipped cream.', { badges: ['bestseller'], featured: true }),
  coffee('Mocha Frappé', 165, 'frappe', 'double', 'Chocolate and espresso blended with ice, cream on top and cocoa dusted over.', { featured: true }),
  coffee('Caramel Frappé', 165, 'frappe', 'double', 'Burnt caramel syrup blended through, with a caramel lattice on the cream.', { badges: ['new'] }),
  coffee('Ube Espresso Frappé', 175, 'frappe', 'triple', 'Ube halaya and a triple shot blended with ice — the local answer to a frappuccino.', { badges: ['new', 'limited'], featured: true }),
  coffee('Matcha Espresso Fusion', 175, 'frappe', 'double', 'Matcha and espresso layered so the green sits over the brown until you stir it.', { badges: ['limited'] }),
]
