import type { Donut, ProductBadge } from '~/types/shop'
import { IMAGE_LIBRARY } from './imageLibrary'
import { createdDaysAgo, pesos, slugify } from './helpers'

const DONUT_PHOTOS = IMAGE_LIBRARY.donuts ?? []

let donutIndex = 0

function donut(
  name: string,
  piece: number,
  glaze: string | undefined,
  filling: string | undefined,
  description: string,
  options: { badges?: ProductBadge[]; featured?: boolean } = {},
): Donut {
  const index = donutIndex++
  const photo = DONUT_PHOTOS[index]
  return {
    id: `donut-${String(index + 1).padStart(2, '0')}`,
    slug: slugify(name),
    name,
    description,
    category: 'donuts',
    priceFrom: piece,
    images: photo ? [photo] : [],
    badges: options.badges,
    leadTime: '2 hours',
    featured: options.featured ?? false,
    active: true,
    createdAt: createdDaysAgo(index),
    ...(filling ? { filling } : {}),
    ...(glaze ? { glaze } : {}),
    boxSizes: [
      { count: 1, price: piece },
      { count: 6, price: pesos(piece * 5.4) },
      { count: 12, price: pesos(piece * 10) },
    ],
  }
}

export const DONUTS: Donut[] = [
  donut(
    'Classic Sugar Ring',
    45,
    'Sugar',
    undefined,
    'Yeasted ring rolled in fine sugar while still warm from the fryer. Nothing else needed.',
    { badges: ['bestseller'], featured: true },
  ),
  donut(
    'Ube Glazed',
    55,
    'Ube',
    undefined,
    'Ube halaya thinned into a glaze and dipped thick, with a scatter of toasted coconut.',
    { badges: ['bestseller'], featured: true },
  ),
  donut('Chocolate Sprinkles', 55, 'Chocolate', undefined, 'Dark chocolate glaze with rainbow sprinkles pressed in before it sets.', { featured: true }),
  donut('Strawberry Frosted', 55, 'Strawberry', undefined, 'Real strawberry purée in the frosting, so it tastes of fruit rather than pink.', { featured: true }),
  donut('Bavarian Cream', 65, undefined, 'Bavarian', 'Filled to bursting with vanilla Bavarian cream and dusted with powdered sugar.', { badges: ['bestseller'], featured: true }),
  donut('Chocolate Bavarian', 65, 'Chocolate', 'Chocolate', 'A chocolate-cream filling under a chocolate glaze — deliberately too much.', { featured: true }),
  donut('Custard Filled', 65, undefined, 'Custard', 'Egg custard cooked in-house and piped in cold, then rolled in sugar.', { featured: true }),
  donut('Matcha White Choco', 70, 'Matcha', undefined, 'White chocolate glaze with matcha dusted over the top — sweet with a green, bitter edge.', { badges: ['new'], featured: true }),
  donut('Cookies & Cream', 65, 'Cookies & cream', undefined, 'Crushed sandwich cookies folded into the glaze and crumbled over the top.', { featured: true }),
  donut('Calamansi Glazed', 55, 'Calamansi', undefined, 'Tart calamansi glaze that cuts through the fried dough — our most Bicol donut.', { badges: ['new'] }),
  donut('Salted Caramel Ring', 65, 'Caramel', undefined, 'Burnt caramel glaze with a pinch of sea salt on the finish.', { badges: ['new'] }),
  donut('Pili Nut Crunch', 75, 'Caramel', 'Pili nut', 'Caramel glaze packed with chopped roasted pili nuts from Bicol.', { badges: ['limited'] }),
  donut('Espresso Dusted', 65, 'Sugar', undefined, 'Sugar glaze with a heavy dusting of finely ground espresso.', {}),
  donut('Buko Pandan Filled', 70, 'Pandan', 'Buko pandan', 'Pandan glaze over a young-coconut filling — cold, creamy and unmistakably local.', { badges: ['seasonal'] }),
  donut('Mango Cream Filled', 70, 'Sugar', 'Mango', 'Mango cream filling with a light sugar glaze, made only when mangoes are sweet.', { badges: ['seasonal'] }),
]
