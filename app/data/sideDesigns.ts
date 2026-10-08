import type { CoatingColor, SideDesignDef } from '~/types/cake'

export const SIDE_DESIGNS: SideDesignDef[] = [
  { id: 'side-none', name: 'None', price: 0, blurb: 'Clean, unadorned finish' },
  { id: 'side-piping-dots', name: 'Piped Pearls', price: 8, blurb: 'A row of buttercream pearls' },
  { id: 'side-piping-scallop', name: 'Scallop Border', price: 10, blurb: 'Classic shell border' },
  { id: 'side-stripes', name: 'Stripes', price: 6, blurb: 'Vertical candy stripes' },
  { id: 'side-pearls', name: 'Pearl Band', price: 12, blurb: 'A ribbon of sugar pearls' },
  { id: 'side-ribbon', name: 'Satin Ribbon', price: 14, blurb: 'Real satin ribbon with a bow' },
  { id: 'side-message', name: 'Message', price: 12, blurb: 'Piped lettering of your choice' },
  { id: 'side-sprinkles', name: 'Sprinkles', price: 10, blurb: 'Hand-scattered confetti sprinkles' },
]

export const getSideDesign = (id: string): SideDesignDef =>
  SIDE_DESIGNS.find((s) => s.id === id) ?? SIDE_DESIGNS[0]!

export const SIDE_COLORS: CoatingColor[] = [
  { id: 'white', name: 'White', hex: '#ffffff' },
  { id: 'gold', name: 'Gold', hex: '#d9b45b' },
  { id: 'blush', name: 'Blush', hex: '#f4b8c6' },
  { id: 'rose', name: 'Rose', hex: '#e2547a' },
  { id: 'sky', name: 'Sky', hex: '#8fbfe8' },
  { id: 'cocoa', name: 'Cocoa', hex: '#a9744c' },
  { id: 'charcoal', name: 'Charcoal', hex: '#43444c' },
  { id: 'chocolate', name: 'Chocolate', hex: '#5d3a24' },
]

export const getSideColorName = (hex: string): string => {
  const match = SIDE_COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase())
  return match?.name ?? 'Custom'
}
