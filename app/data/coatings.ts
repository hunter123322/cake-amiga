import type { CoatingColor, CoatingFinish } from '~/types/cake'

export const COATING_FINISHES: CoatingFinish[] = [
  { id: 'coating-smooth', name: 'Smooth', price: 0, blurb: 'Glass-like flat buttercream' },
  { id: 'coating-textured', name: 'Swirl', price: 6, blurb: 'Soft hand-swirled strokes' },
  { id: 'coating-drip', name: 'Drip', price: 8, blurb: 'Glossy glaze drips down the sides' },
  { id: 'coating-rustic', name: 'Rustic', price: 6, blurb: 'Spatula sweeps, half-frosted look' },
]

export const COATING_COLORS: CoatingColor[] = [
  { id: 'white', name: 'Snow White', hex: '#ffffff' },
  { id: 'ivory', name: 'Ivory', hex: '#f8f0dd' },
  { id: 'blush', name: 'Blush Pink', hex: '#f7c6d0' },
  { id: 'rose', name: 'Rose', hex: '#e79db1' },
  { id: 'mint', name: 'Mint', hex: '#bfe6d4' },
  { id: 'sky', name: 'Sky Blue', hex: '#bcd8f0' },
  { id: 'lavender', name: 'Lavender', hex: '#d6c8ef' },
  { id: 'butter', name: 'Butter', hex: '#f9e6a8' },
  { id: 'sage', name: 'Sage', hex: '#cbd8b4' },
  { id: 'cocoa', name: 'Cocoa', hex: '#b07a52' },
  { id: 'chocolate', name: 'Chocolate', hex: '#6b4230' },
  { id: 'charcoal', name: 'Charcoal', hex: '#3f3f46' },
]

export const getCoatingFinish = (id: string): CoatingFinish =>
  COATING_FINISHES.find((f) => f.id === id) ?? COATING_FINISHES[0]!

export const getCoatingColorName = (hex: string): string => {
  const match = COATING_COLORS.find(
    (c) => c.hex.toLowerCase() === hex.toLowerCase(),
  )
  return match?.name ?? 'Custom'
}
