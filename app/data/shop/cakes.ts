import type { Cake, ProductBadge, SizeOption } from '~/types/shop'
import { createdDaysAgo, pesos, slugify } from './helpers'

/**
 * The cake catalogue mirrors `public/img/cake` one-for-one: each product is named
 * after its photograph, so a card's image and its title always agree.
 *
 * `ProductCard.vue` repeats these titles as hardcoded strings (and repeats the
 * best-seller list); keep the two in sync when a photo is renamed.
 *
 * The eight best sellers — Kuromi Theme, Paw Patrol First, Mango Fruit, Red Rose,
 * Caramel Drip, Chocolate Shavings Sheet, Assorted Mini Bento and The Little
 * Mermaid — are the ones flagged `featured` and badged `bestseller`.
 */

type CakeShape = 'round' | 'bento' | 'sheet' | 'cupcake'

interface ShapeProfile {
  steps: { label: string; factor: number; servings: number }[]
}

const SHAPES: Record<CakeShape, ShapeProfile> = {
  round: {
    steps: [
      { label: '6" round', factor: 1, servings: 8 },
      { label: '8" round', factor: 1.5, servings: 14 },
      { label: '10" round', factor: 2.1, servings: 24 },
    ],
  },
  bento: {
    steps: [
      { label: 'Single bento box', factor: 1, servings: 1 },
      { label: 'Set of 4 minis', factor: 3.2, servings: 4 },
      { label: 'Set of 9 minis', factor: 6, servings: 9 },
    ],
  },
  sheet: {
    steps: [
      { label: 'Quarter sheet', factor: 1, servings: 12 },
      { label: 'Half sheet', factor: 1.8, servings: 24 },
      { label: 'Full sheet', factor: 3.2, servings: 48 },
    ],
  },
  cupcake: {
    steps: [
      { label: 'Box of 6', factor: 1, servings: 6 },
      { label: 'Box of 12', factor: 1.9, servings: 12 },
      { label: 'Box of 24', factor: 3.6, servings: 24 },
    ],
  },
}

function sizes(base: number, shape: CakeShape): SizeOption[] {
  return SHAPES[shape].steps.map((step) => ({
    label: step.label,
    price: pesos(base * step.factor),
    servings: step.servings,
  }))
}

let index = 0
let featuredIndex = 0
/** Featured rows get the newest dates so they lead the home page and "Newest" sort. */
const REST_START = 8

function cake(
  file: string,
  title: string,
  base: number,
  occasion: string[],
  flavors: string[],
  description: string,
  options: { shape?: CakeShape; badges?: ProductBadge[]; featured?: boolean; leadTime?: string } = {},
): Cake {
  const current = index++
  const shape = options.shape ?? 'round'
  const priceList = sizes(base, shape)
  const recency = options.featured ? featuredIndex++ : REST_START + index
  return {
    id: `cake-${String(current + 1).padStart(2, '0')}`,
    slug: slugify(title),
    name: title,
    description,
    category: 'cakes',
    priceFrom: priceList[0]?.price ?? base,
    images: file ? [`/img/cake/${file}`] : [],
    badges: options.badges,
    leadTime: options.leadTime ?? '3 days',
    featured: options.featured ?? false,
    active: true,
    createdAt: createdDaysAgo(recency),
    occasion,
    flavors,
    sizes: priceList,
  }
}

const BEST: ProductBadge[] = ['bestseller']
const BIRTHDAY = ['Birthday']

export const CAKES: Cake[] = [
  cake('11_shaped_floral_cake.webp', '11 Shaped Floral Cake', 1450, BIRTHDAY, ['Vanilla chiffon', 'Buttercream'],
    'Two number-shaped layers piped edge to edge with buttercream flowers, made for an eleventh birthday.'),
  cake('80th_birthday_floral_cake.webp', '80th Birthday Floral Cake', 1400, ['Birthday', 'Anniversary'], ['Vanilla chiffon', 'Buttercream'],
    'A milestone cake: soft chiffon under a full crown of piped blooms and a gold-edged script topper.'),
  cake('art_theme_bdayCake.webp', 'Art Theme Bday Cake', 1200, BIRTHDAY, ['Chocolate'],
    'Painted buttercream in bold abstract strokes, for the birthday of someone who would rather not have roses.'),
  cake('assorted_mini_bento_cakes.webp', 'Assorted Mini Bento Cakes', 560, ['Birthday', 'Just because'], ['Assorted'],
    'A mixed set of mini bento cakes, each a different flavour and colour, boxed one by one.',
    { shape: 'bento', badges: BEST, featured: true }),
  cake('beach_theme_bdayCake.webp', 'Beach Theme Bday Cake', 1300, BIRTHDAY, ['Vanilla chiffon'],
    'Sand-coloured buttercream, a piped shoreline and shells — a beach party you can slice.'),
  cake('berry_mousse_slice.webp', 'Berry Mousse Slice', 950, ['Birthday', 'Just because'], ['Berry', 'Mousse'],
    'Berry mousse layered over vanilla sponge under a mirror glaze, finished with fresh berries.'),
  cake('blue_crown_bdayCake.webp', 'Blue Crown Bday Cake', 1250, BIRTHDAY, ['Vanilla chiffon'],
    'A blue buttercream crown and a tiara topper, built for the prince or princess of the day.'),
  cake('brave_theme_bdayCake.webp', 'Brave Theme Bday Cake', 1250, BIRTHDAY, ['Chocolate'],
    'A Brave-themed cake with hand-piped arrows and a character topper for a young archer.'),
  cake('caramel_drip_cake.webp', 'Caramel Drip Cake', 1300, ['Birthday', 'Anniversary'], ['Caramel', 'Chocolate'],
    'Salted caramel dripped down swirled buttercream and finished with toffee shards.',
    { badges: BEST, featured: true }),
  cake('cartoon_character_bdayCake.webp', 'Cartoon Character Bday Cake', 1250, BIRTHDAY, ['Vanilla chiffon'],
    'Hand-piped cartoon characters across a buttercream sheet — tell us who the birthday kid loves.'),
  cake('chef_theme_cake.webp', 'Chef Theme Cake', 1200, ['Birthday', 'Graduation'], ['Chocolate'],
    'A chef’s hat, whisk and piping bag in icing, for a graduation or a kitchen-obsessed birthday.'),
  cake('cherry_pink_bdayCake.webp', 'Cherry Pink Bday Cake', 1150, BIRTHDAY, ['Cherry', 'Vanilla chiffon'],
    'Pink swirled buttercream with glossy cherries and a piped shell border.'),
  cake('chocolate_shavings_sheet_cake.webp', 'Chocolate Shavings Sheet Cake', 1450, ['Birthday', 'Just because'], ['Chocolate'],
    'A big chocolate sheet cake under a thick drift of chocolate shavings — the office-party default.',
    { shape: 'sheet', badges: BEST, featured: true }),
  cake('christening_cake.webp', 'Christening Cake', 1600, ['Christening'], ['Vanilla chiffon', 'Buttercream'],
    'White-on-white buttercream with a piped cross and a name plaque, baked for a christening.'),
  cake('christening_v2_cake.webp', 'Christening V2 Cake', 1650, ['Christening'], ['Vanilla chiffon'],
    'A softer second christening design: pale blue piping, dotted tiers and a scripted name.'),
  cake('crown&fruit_bento_cakes.webp', 'Crown & Fruit Bento Cakes', 590, ['Birthday', 'Just because'], ['Fresh fruit'],
    'Mini bento cakes crowned with a piped crown and piled with fresh fruit.',
    { shape: 'bento' }),
  cake('double_bdayCake.webp', 'Double Bday Cake', 1500, BIRTHDAY, ['Chocolate', 'Vanilla chiffon'],
    'Two cakes stacked as one — chocolate over vanilla — for a joint birthday.'),
  cake('elegant_floral_80th_mom_bdayCake.webp', 'Elegant Floral 80th Mom Bday Cake', 1550, ['Birthday', 'Anniversary'], ['Vanilla chiffon', 'Buttercream'],
    'An 80th birthday cake for a mother: ivory buttercream, soft florals and a gold number topper.'),
  cake('elegant_white_rose_cake.webp', 'Elegant White Rose Cake', 1350, ['Wedding', 'Anniversary'], ['Vanilla chiffon'],
    'White roses, rolled edges and a clean buttercream finish — a quiet celebration cake.'),
  cake('first_bdayCake.webp', 'First Bday Cake', 1250, BIRTHDAY, ['Vanilla chiffon'],
    'A first birthday cake with pastel piping, a number-one topper and a smash-cake crumb.'),
  cake('floral_bouquet_cake.webp', 'Floral Bouquet Cake', 1400, ['Wedding', 'Anniversary'], ['Vanilla chiffon', 'Buttercream'],
    'A bouquet of piped blooms arranged up one side of the cake — no vase required.'),
  cake('fresh_fruit_bdayCake.webp', 'Fresh Fruit Bday Cake', 1300, BIRTHDAY, ['Fresh fruit', 'Vanilla chiffon'],
    'Whipped cream, glazed strawberries and kiwi, for the fruit-forward birthday.'),
  cake('fruit_cream_cakes.webp', 'Fruit Cream Cakes', 1200, ['Birthday', 'Just because'], ['Fresh fruit', 'Cream'],
    'Soft sponge, whipped cream and a mix of fresh fruit, finished simply and kept cold.'),
  cake('hand_drawn_bdayCake.webp', 'Hand Drawn Bday Cake', 1250, BIRTHDAY, ['Vanilla chiffon'],
    'Hand-drawn buttercream linework: a doodle of everything the birthday person loves.'),
  cake('jollibee_1st_bdayCake.webp', 'Jollibee 1st Bday Cake', 1300, BIRTHDAY, ['Chocolate'],
    'A Jollibee-themed first birthday cake with the bee piped on top and red-and-yellow trim.'),
  cake('kuromi_face_bdayCake.webp', 'Kuromi Face Bday Cake', 1250, BIRTHDAY, ['Vanilla chiffon'],
    'Kuromi’s face piped flat across the top in black and lilac buttercream.'),
  cake('kuromi_theme_bdayCake.webp', 'Kuromi Theme Bday Cake', 1350, BIRTHDAY, ['Vanilla chiffon'],
    'A full Kuromi theme: purple drip, character topper and matching cupcakes to finish.',
    { badges: BEST, featured: true }),
  cake('lotus_bento_cakes.webp', 'Lotus Bento Cakes', 620, ['Birthday', 'Just because'], ['Lotus Biscoff', 'Caramel'],
    'Bento cakes finished with crushed Lotus Biscoff and a caramel drip.',
    { shape: 'bento' }),
  cake('mango_fruit_cake.webp', 'Mango Fruit Cake', 1400, ['Birthday', 'Just because'], ['Mango', 'Fresh fruit'],
    'Sweet mango cubes and cream over graham layers, kept cold until the moment you collect it.',
    { badges: BEST, featured: true }),
  cake('mermaid_topper_bdayCake.webp', 'Mermaid Topper Bday Cake', 1300, BIRTHDAY, ['Vanilla chiffon'],
    'Ocean-swirled buttercream with a mermaid topper and a wave of piped scales.'),
  cake('mini_bento_cake_set.webp', 'Mini Bento Cake Set', 520, ['Just because', 'Birthday'], ['Vanilla chiffon'],
    'The plain mini bento set — four small cakes, ready to gift, with a message piped on top.',
    { shape: 'bento' }),
  cake('minimalist_funny_bdayCake.webp', 'Minimalist Funny Bday Cake', 1200, BIRTHDAY, ['Vanilla chiffon'],
    'Smooth white buttercream and one very rude, very funny piece of piped script.'),
  cake('number_shaped_floral_cake.webp', 'Number Shaped Floral Cake', 1450, ['Birthday', 'Anniversary'], ['Vanilla chiffon', 'Buttercream'],
    'A number-shaped cake covered in piped flowers — tell us the digits and the palette.'),
  cake('pastel_mini_bento_cakes.webp', 'Pastel Mini Bento Cakes', 560, ['Just because', 'Birthday'], ['Vanilla chiffon'],
    'Pastel bento minis in a row, each finished with a different buttercream swirl.',
    { shape: 'bento' }),
  cake('paw_patrol_first_bdayCake.webp', 'Paw Patrol First Bday Cake', 1350, BIRTHDAY, ['Chocolate'],
    'Paw Patrol toppers, blue icing and paw-print piping for a first birthday.',
    { badges: BEST, featured: true }),
  cake('peach_floral_80th_bdayCake.webp', 'Peach Floral 80th Bday Cake', 1500, ['Birthday', 'Anniversary'], ['Vanilla chiffon', 'Buttercream'],
    'Peach-toned florals with a gold script topper, for an 80th birthday.'),
  cake('pink_floral_bdayCake.webp', 'Pink Floral Bday Cake', 1300, BIRTHDAY, ['Vanilla chiffon', 'Buttercream'],
    'Pink buttercream flowers climbing one side of the cake — the birthday classic.'),
  cake('pink_house_topper_bdayCake.webp', 'Pink House Topper Bday Cake', 1350, BIRTHDAY, ['Vanilla chiffon'],
    'A little pink house topper on swirled buttercream, for a housewarming or a birthday.'),
  cake('pink_rose_bdayCake.webp', 'Pink Rose Bday Cake', 1250, ['Birthday', 'Anniversary'], ['Vanilla chiffon'],
    'A ring of pink roses piped around the rim over a smooth buttercream finish.'),
  cake('prince_crown_bdayCake.webp', 'Prince Crown Bday Cake', 1300, BIRTHDAY, ['Chocolate'],
    'A prince crown topper on blue-and-silver buttercream, built for a first or second birthday.'),
  cake('purple_floral_sister_bdayCake.webp', 'Purple Floral Sister Bday Cake', 1350, ['Birthday', 'Graduation'], ['Vanilla chiffon', 'Buttercream'],
    'Purple blooms and a scripted greeting, piped for a sister’s birthday.'),
  cake('purple_photo_topper_bdayCake.webp', 'Purple Photo Topper Bday Cake', 1400, BIRTHDAY, ['Vanilla chiffon'],
    'Purple piping with a printed photo topper — send us the picture and we will print it.'),
  cake('rainbow_swirl_cupcakes.webp', 'Rainbow Swirl Cupcakes', 480, ['Birthday', 'Graduation'], ['Vanilla chiffon'],
    'Rainbow swirls on vanilla cupcakes, boxed by the half dozen.',
    { shape: 'cupcake' }),
  cake('red_rose_80th_bdayCake.webp', 'Red Rose 80th Bday Cake', 1500, ['Birthday', 'Anniversary'], ['Chocolate'],
    'Deep red roses and a gold 80, for a milestone birthday.'),
  cake('red_rose_bdayCake.webp', 'Red Rose Bday Cake', 1350, ['Birthday', 'Anniversary'], ['Vanilla chiffon'],
    'Red roses piped over a white buttercream cake — birthday or anniversary, it works either way.',
    { badges: BEST, featured: true }),
  cake('square_script_bdayCake.webp', 'Square Script Bday Cake', 1300, BIRTHDAY, ['Vanilla chiffon'],
    'A square cake with clean edges and hand-piped script running across the top.'),
  cake('the_little_mermaid_bdayCake.webp', 'The Little Mermaid Bday Cake', 1350, BIRTHDAY, ['Vanilla chiffon'],
    'Under-the-sea buttercream with a Little Mermaid topper and piped bubbles.',
    { badges: BEST, featured: true }),
  cake('tuxedo_60th_bdayCake.webp', 'Tuxedo 60th Bday Cake', 1450, ['Birthday', 'Anniversary'], ['Chocolate'],
    'Black-and-white tuxedo panels with a bow tie, for a 60th birthday.'),
  cake('wedding_bride_cake.webp', 'Wedding Bride Cake', 1800, ['Wedding'], ['Vanilla chiffon', 'Buttercream'],
    'A bridal cake in ivory buttercream with lace-fine piping and fresh-style roses.'),
  // No photograph: the tiered cake is configured in the builder, so it also keeps
  // the "photo coming soon" tile visible in the grid.
  cake('', 'Custom Tiered Cake', 3200, ['Wedding', 'Birthday', 'Christening'], ['Your choice'],
    'Two or three tiers designed with you, priced per tier. Start in the cake builder and we will confirm the sketch.',
    { leadTime: '7 days' }),
]
