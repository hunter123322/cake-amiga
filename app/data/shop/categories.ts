import type { CategoryMeta, CategorySlug } from '~/types/shop'

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'cakes',
    label: 'Cakes',
    icon: 'cake',
    h1: 'Cakes in Bacacay, Albay',
    tagline: 'Baked to order, decorated by hand',
    intro:
      'Celebration cakes baked to order — chiffon layers, real buttercream and fillings cooked in Bacacay.',
    cover: '/img/cake/elegant_white_rose_cake.webp',
    seoTitle: 'Cakes in Bacacay, Albay — Baked to Order | Cake Amiga',
    seoDescription:
      'Order celebration cakes in Bacacay, Albay: birthday, wedding and christening designs from ₱480. Chiffon, ube, red velvet and custom flavours. Build your own cake online.',
    facets: [
      { field: 'occasion', label: 'Occasion' },
      { field: 'flavors', label: 'Flavour' },
      { field: 'sizes', label: 'Size' },
    ],
    priceSteps: [800, 1500, 2500, 4000],
    leadNote: 'Ready in 3 days',
    linksBuilder: true,
    orderNote: 'Cakes are made to order — reserve at least 3 days ahead.',
  },
  {
    slug: 'drinks',
    label: 'Drinks',
    icon: 'cup',
    h1: 'Drinks to go',
    tagline: 'Milk tea, fruit coolers and shakes',
    intro:
      'Blended to order with real fruit, brewed tea and shaved ice — most orders are ready in ten minutes.',
    seoTitle: 'Milk Tea & Fruit Drinks in Bacacay, Albay | Cake Amiga',
    seoDescription:
      'Milk tea, fruit coolers, shakes and sodas in Bacacay, Albay. Blended to order from ₱79 with adjustable sweetness. Pickup or delivery within 10 km.',
    facets: [
      { field: 'drinkType', label: 'Type' },
      { field: 'sizes', label: 'Size' },
    ],
    priceSteps: [99, 129, 159],
    leadNote: 'Ready in 10 min',
    orderNote: 'Drinks are blended to order — ready in about 10 minutes.',
  },
  {
    slug: 'coffee',
    label: 'Coffee',
    icon: 'coffee',
    h1: 'Coffee & espresso',
    tagline: 'Bicol beans, brewed three ways',
    intro:
      'Hot, iced or frappé, pulled from locally roasted Bicol arabica and liberica.',
    seoTitle: 'Coffee in Bacacay, Albay — Hot, Iced & Frappé | Cake Amiga',
    seoDescription:
      'Espresso, iced latte and frappé in Bacacay, Albay from ₱95. Locally roasted Bicol arabica and liberica, brewed hot, iced or frozen.',
    facets: [
      { field: 'brewType', label: 'Brew' },
      { field: 'strength', label: 'Strength' },
    ],
    priceSteps: [109, 139, 179],
    leadNote: 'Ready in 8 min',
    orderNote: 'Espresso drinks are pulled to order — ready in about 8 minutes.',
  },
  {
    slug: 'donuts',
    label: 'Donuts',
    icon: 'donut',
    h1: 'Glazed & filled donuts',
    tagline: 'Fried fresh every morning',
    intro:
      'Hand-cut rings and filled pillows, glazed while still warm and fried fresh every morning.',
    seoTitle: 'Donuts in Bacacay, Albay — Glazed & Filled | Cake Amiga',
    seoDescription:
      'Fresh glazed and filled donuts in Bacacay, Albay from ₱45 each, or a box of six from ₱250. Ube, chocolate, strawberry and classic sugar.',
    facets: [
      { field: 'glaze', label: 'Glaze' },
      { field: 'filling', label: 'Filling' },
    ],
    priceSteps: [50, 300, 600],
    leadNote: 'Same day',
    orderNote: 'Donuts are fried daily — same-day pickup, boxes need 2 hours notice.',
  },
  {
    slug: 'bread',
    label: 'Bread',
    icon: 'bread',
    h1: 'Bread from the oven',
    tagline: 'Out of the oven from 6:00 AM',
    intro:
      'Loaves, buns and Bicol favourites, baked before sunrise every morning.',
    seoTitle: 'Fresh Bread & Loaves in Bacacay, Albay | Cake Amiga',
    seoDescription:
      'Fresh bread baked daily in Bacacay, Albay from ₱65: sandwich loaves, pandesal, pan de coco, cheese bread and Spanish bread.',
    facets: [{ field: 'breadType', label: 'Type' }],
    priceSteps: [80, 150, 250],
    leadNote: 'Daily from 6 AM',
    orderNote: 'Bread is baked daily — reserve a loaf before 8:00 PM for next-morning pickup.',
  },
]

export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c])) as Record<
  CategorySlug,
  CategoryMeta
>

export function isCategorySlug(value: string): value is CategorySlug {
  return Object.prototype.hasOwnProperty.call(CATEGORY_BY_SLUG, value)
}
