import type { CoatingColor, TopDesignDef } from '~/types/cake'

export const TOP_DESIGNS: TopDesignDef[] = [
  { id: 'top-none', name: 'Plain Top', price: 0, blurb: 'Just the beautiful finish', elevation: 0.25 },
  { id: 'top-flowers', name: 'Fresh Roses', price: 22, blurb: 'A crown of piped roses', elevation: 1.0 },
  {
    id: 'top-candles',
    name: 'Candles',
    price: 12,
    blurb: 'Light up the party',
    elevation: 1.2,
    candleCount: true,
  },
  { id: 'top-topper-happy', name: 'Happy Birthday Sign', price: 18, blurb: 'Glitter card topper', elevation: 1.9 },
  {
    id: 'top-topper-number',
    name: 'Number Topper',
    price: 16,
    blurb: 'Pick the milestone number',
    elevation: 1.8,
    number: true,
  },
  { id: 'top-fruit', name: 'Berry Crown', price: 20, blurb: 'Strawberries & blueberries', elevation: 1.0 },
  { id: 'top-figurine', name: 'Figurine', price: 26, blurb: 'A little character to keep', elevation: 1.7 },
  { id: 'top-drip', name: 'Choco Drip Crown', price: 18, blurb: 'Chocolate drip + sprinkles', elevation: 0.6 },
]

export const getTopDesign = (id: string): TopDesignDef =>
  TOP_DESIGNS.find((t) => t.id === id) ?? TOP_DESIGNS[0]!

export const TOP_COLORS: CoatingColor[] = [
  { id: 'white', name: 'White', hex: '#ffffff' },
  { id: 'gold', name: 'Gold', hex: '#e3bc5f' },
  { id: 'blush', name: 'Blush', hex: '#f4b8c6' },
  { id: 'rose', name: 'Rose', hex: '#e2547a' },
  { id: 'sky', name: 'Sky', hex: '#8fbfe8' },
  { id: 'cocoa', name: 'Cocoa', hex: '#a9744c' },
  { id: 'chocolate', name: 'Chocolate', hex: '#5d3a24' },
  { id: 'charcoal', name: 'Charcoal', hex: '#43444c' },
]
