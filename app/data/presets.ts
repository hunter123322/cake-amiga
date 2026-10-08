import type { AddOnId, CoatingFinishId, SideDesignId, TopDesignId } from '~/types/cake'

export interface PresetTier {
  diameterIn: number
  heightIn: number
  flavorId: string
}

export interface CakePreset {
  id: string
  name: string
  emoji: string
  blurb: string
  tiers: PresetTier[]
  coating: { finish: CoatingFinishId; color: string }
  sideDesign: { id: SideDesignId; color: string; message: string }
  topDesign: { id: TopDesignId; color: string; candleCount: number; number: string }
  addOns: AddOnId[]
}

/** Presets are ordered bottom tier first. */
export const PRESETS: CakePreset[] = [
  {
    id: 'signature',
    name: 'Signature',
    emoji: '🎂',
    blurb: 'Our 3-tier bestseller',
    tiers: [
      { diameterIn: 12, heightIn: 4, flavorId: 'vanilla' },
      { diameterIn: 10, heightIn: 4, flavorId: 'chocolate' },
      { diameterIn: 8, heightIn: 4, flavorId: 'strawberry' },
    ],
    coating: { finish: 'coating-smooth', color: '#f8f0dd' },
    sideDesign: { id: 'side-piping-scallop', color: '#d9b45b', message: '' },
    topDesign: { id: 'top-flowers', color: '#f4b8c6', candleCount: 5, number: '1' },
    addOns: [],
  },
  {
    id: 'wedding',
    name: 'Wedding',
    emoji: '💍',
    blurb: 'Ivory, pearls and roses',
    tiers: [
      { diameterIn: 12, heightIn: 5, flavorId: 'vanilla' },
      { diameterIn: 9, heightIn: 4, flavorId: 'lemon' },
      { diameterIn: 8, heightIn: 4, flavorId: 'vanilla' },
    ],
    coating: { finish: 'coating-smooth', color: '#ffffff' },
    sideDesign: { id: 'side-pearls', color: '#ffffff', message: '' },
    topDesign: { id: 'top-flowers', color: '#ffffff', candleCount: 3, number: '1' },
    addOns: ['addon-plates'],
  },
  {
    id: 'kids-party',
    name: 'Kids Party',
    emoji: '🎉',
    blurb: 'Funfetti, sprinkles, sparkle',
    tiers: [
      { diameterIn: 10, heightIn: 4, flavorId: 'funfetti' },
      { diameterIn: 8, heightIn: 4, flavorId: 'chocolate' },
    ],
    coating: { finish: 'coating-smooth', color: '#bcd8f0' },
    sideDesign: { id: 'side-sprinkles', color: '#e2547a', message: '' },
    topDesign: { id: 'top-figurine', color: '#8fbfe8', candleCount: 5, number: '1' },
    addOns: ['addon-candles', 'addon-plates'],
  },
  {
    id: 'rustic',
    name: 'Rustic',
    emoji: '🌿',
    blurb: 'Spatula-frosted cocoa',
    tiers: [
      { diameterIn: 10, heightIn: 4, flavorId: 'coffee' },
      { diameterIn: 8, heightIn: 4, flavorId: 'pistachio' },
    ],
    coating: { finish: 'coating-rustic', color: '#b07a52' },
    sideDesign: { id: 'side-none', color: '#ffffff', message: '' },
    topDesign: { id: 'top-drip', color: '#5d3a24', candleCount: 4, number: '1' },
    addOns: ['addon-knife'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    emoji: '🤍',
    blurb: 'One tall, clean tier',
    tiers: [{ diameterIn: 8, heightIn: 6, flavorId: 'vanilla' }],
    coating: { finish: 'coating-smooth', color: '#ffffff' },
    sideDesign: { id: 'side-none', color: '#ffffff', message: '' },
    topDesign: { id: 'top-none', color: '#ffffff', candleCount: 1, number: '1' },
    addOns: [],
  },
]

export const DEFAULT_PRESET_ID = 'signature'

export const getPreset = (id: string): CakePreset =>
  PRESETS.find((p) => p.id === id) ?? PRESETS[0]!
