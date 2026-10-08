import type { Bread, BreadType, ProductBadge } from '~/types/shop'
import { createdDaysAgo, pesos, slugify } from './helpers'

let breadIndex = 0

/** "Pack of 6" → "Pack of 12", so pack tiers stay consistent per item. */
function doublePack(label: string): string {
  return label.replace(/\d+/, (n) => String(Number(n) * 2))
}

function bread(
  name: string,
  breadType: BreadType,
  base: number,
  sizeLabel: string,
  description: string,
  options: { badges?: ProductBadge[]; featured?: boolean; single?: boolean } = {},
): Bread {
  const isLoaf = breadType === 'loaf'
  const packSizes = options.single
    ? [{ label: sizeLabel, price: base }]
    : isLoaf
      ? [
          { label: `Whole loaf · ${sizeLabel}`, price: base },
          { label: `Half loaf · ${sizeLabel}`, price: pesos(base * 0.6) },
        ]
      : [
          { label: sizeLabel, price: base },
          { label: doublePack(sizeLabel), price: pesos(base * 1.85) },
        ]

  return {
    id: `bread-${String(breadIndex + 1).padStart(2, '0')}`,
    slug: slugify(name),
    name,
    description,
    category: 'bread',
    priceFrom: Math.min(...packSizes.map((p) => p.price)),
    // No bread photography exists yet — these render the "photo coming soon" tile.
    images: [],
    badges: options.badges,
    leadTime: 'Daily, 6 AM',
    featured: options.featured ?? false,
    active: true,
    createdAt: createdDaysAgo(breadIndex++),
    breadType,
    ...(isLoaf ? { weight: sizeLabel } : {}),
    packSizes,
  }
}

export const BREADS: Bread[] = [
  bread('Tasty Sandwich Loaf', 'loaf', 95, '450 g', 'Soft white loaf, sliced evenly and packed while cool so it toasts without crumbling.', {
    badges: ['bestseller'],
    featured: true,
  }),
  bread('Whole Wheat Loaf', 'loaf', 115, '450 g', 'Stone-milled whole wheat with a little honey — denser, nuttier and better with butter.', { featured: true }),
  bread('Ube Loaf', 'loaf', 130, '450 g', 'Purple yam swirled through the dough so each slice has its own pattern.', { badges: ['bestseller'], featured: true }),
  bread('Pandesal', 'bun', 85, 'Pack of 12', 'Baked twice a day, dusted with breadcrumbs. Best eaten within the hour, ideally dipped in coffee.', {
    badges: ['bestseller'],
    featured: true,
  }),
  bread('Pan de Coco', 'sweet', 95, 'Pack of 6', 'Sweetened coconut filling rolled into a soft bun and glazed with syrup.', { featured: true }),
  bread('Spanish Bread', 'sweet', 95, 'Pack of 6', 'Buttery crumbs of sugar and margarine rolled inside, brushed with more of the same on top.', { featured: true }),
  bread('Cheese Bread', 'savory', 105, 'Pack of 6', 'Grated quick-melt cheese in the dough and on top, pulled from the oven golden.', { featured: true }),
  bread('Ensaymada', 'sweet', 145, 'Pack of 6', 'Brioche-style bun with a piped buttercream crown and a snowfall of grated cheese.', { featured: true }),
  bread('Monay', 'bun', 80, 'Pack of 6', 'A dense, faintly sweet roll — the traditional partner for a cup of black coffee.', {}),
  bread('Siopao Bun Dough', 'bun', 90, 'Pack of 6', 'Plain steamed-bun dough, ready to fill at home. Keeps two days at room temperature.', {}),
  bread('Bagong Bayan Bagels', 'bun', 130, 'Pack of 4', 'Boiled then baked, seeded with sesame — chewy in the middle with a blistered crust.', { badges: ['new'] }),
  bread('Bicol Express Bread', 'savory', 155, 'Pack of 6', 'Coconut, shrimp paste and chilli baked into a savoury roll. Not for the timid.', { badges: ['new', 'limited'] }),
  bread('Pan de Sal Slider Buns', 'savory', 110, 'Pack of 8', 'Smaller, sweeter pandesal built for sliders, glazed with butter so the tops shine.', {}),
  bread('Baguette', 'loaf', 120, 'Each', 'Crisp crust, open crumb, baked in the morning for the same-day soup crowd.', { single: true }),
  bread('Sourdough Loaf', 'loaf', 220, '700 g', 'Naturally leavened for eighteen hours with our own starter, kept going since 2021.', {
    badges: ['new'],
    featured: true,
  }),
]
