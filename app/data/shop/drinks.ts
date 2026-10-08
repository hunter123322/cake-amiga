import type { Drink, DrinkType, ProductBadge } from '~/types/shop'
import { IMAGE_LIBRARY } from './imageLibrary'
import { CUP_SIZE_STEPS, createdDaysAgo, roundSizes, slugify } from './helpers'

const DRINK_PHOTOS = IMAGE_LIBRARY.drinks ?? []

const DEFAULT_SWEETNESS = ['0%', '25%', '50%', '75%', '100%']

let drinkIndex = 0

function drink(
  name: string,
  base: number,
  drinkType: DrinkType,
  description: string,
  options: { badges?: ProductBadge[]; featured?: boolean; photo?: boolean; cups?: boolean } = {},
): Drink {
  const index = drinkIndex++
  const photo = options.photo === false ? undefined : DRINK_PHOTOS[index]
  const sizes = roundSizes(base, options.cups === false ? [CUP_SIZE_STEPS[1]!] : CUP_SIZE_STEPS)
  return {
    id: `drink-${String(index + 1).padStart(2, '0')}`,
    slug: slugify(name),
    name,
    description,
    category: 'drinks',
    priceFrom: Math.min(...sizes.map((s) => s.price)),
    images: photo ? [photo] : [],
    badges: options.badges,
    leadTime: '10 min',
    featured: options.featured ?? false,
    active: true,
    createdAt: createdDaysAgo(index),
    drinkType,
    sizes,
    sweetnessLevels: DEFAULT_SWEETNESS,
  }
}

export const DRINKS: Drink[] = [
  drink(
    'Classic Milk Tea',
    89,
    'milk-tea',
    'Brewed black tea, fresh milk and chewy tapioca pearls. The baseline for everything else on this list.',
    { featured: true, badges: ['bestseller'] },
  ),
  drink(
    'Wintermelon Milk Tea',
    89,
    'milk-tea',
    'Roasted wintermelon syrup with milk — caramelly and mild, the one people order for kids.',
    { featured: true, badges: ['bestseller'] },
  ),
  drink(
    'Okinawa Milk Tea',
    99,
    'milk-tea',
    'Brown sugar and roasted tea with a darker, toastier finish than the classic.',
    { featured: true },
  ),
  drink(
    'Taro Milk Tea',
    99,
    'milk-tea',
    'Real taro paste blended smooth with milk and ice — naturally lilac, no colour powder.',
    { featured: true },
  ),
  drink(
    'Brown Sugar Pearl Milk',
    109,
    'milk-tea',
    'Fresh milk poured over warm brown-sugar pearls, so the stripes show before you stir.',
    { badges: ['new'], featured: true },
  ),
  drink(
    'Mango Fruit Tea',
    99,
    'fruit',
    'Ripe mango purée with brewed green tea and popping boba — sweet, sharp and cold.',
    { featured: true },
  ),
  drink(
    'Lychee Cooler',
    95,
    'fruit',
    'Lychee syrup, soda and green tea over crushed ice with whole lychee in the cup.',
  ),
  drink(
    'Strawberry Fruit Tea',
    105,
    'fruit',
    'Muddled strawberries and jasmine tea, sweetened lightly so the fruit keeps the top note.',
    { badges: ['seasonal'] },
  ),
  drink(
    'Calamansi Soda',
    79,
    'soda',
    'Fresh Bicol calamansi squeezed to order and topped with soda — the best thing for a hot afternoon.',
    { featured: true },
  ),
  drink(
    'Blue Lemonade Soda',
    85,
    'soda',
    'Blue curaçao syrup, lemon and soda water. Looks like a swimming pool, tastes like summer.',
  ),
  drink(
    'Buko Juice',
    89,
    'juice',
    'Young coconut water served straight from the shell with strips of fresh buko.',
  ),
  drink(
    'Avocado Shake',
    119,
    'shake',
    'Thick avocado blended with milk, ice and a spoon of condensed milk — a meal in a cup.',
    { featured: true, badges: ['bestseller'] },
  ),
]