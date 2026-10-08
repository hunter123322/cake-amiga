export type CoatingFinishId =
  | 'coating-smooth'
  | 'coating-textured'
  | 'coating-drip'
  | 'coating-rustic'

export type SideDesignId =
  | 'side-none'
  | 'side-piping-dots'
  | 'side-piping-scallop'
  | 'side-stripes'
  | 'side-pearls'
  | 'side-ribbon'
  | 'side-message'
  | 'side-sprinkles'

export type TopDesignId =
  | 'top-none'
  | 'top-flowers'
  | 'top-candles'
  | 'top-topper-happy'
  | 'top-topper-number'
  | 'top-fruit'
  | 'top-figurine'
  | 'top-drip'

export type AddOnId =
  | 'addon-candles'
  | 'addon-knife'
  | 'addon-plates'
  | 'addon-card'
  | 'addon-box'

export interface Tier {
  id: string
  heightIn: number
  diameterIn: number
  flavorId: string
}

export interface Coating {
  finish: CoatingFinishId
  color: string
}

export interface SideDesign {
  id: SideDesignId
  color: string
  message: string
}

export interface TopDesign {
  id: TopDesignId
  color: string
  candleCount: number
  number: string
}

export interface CakeConfig {
  tiers: Tier[]
  coating: Coating
  sideDesign: SideDesign
  topDesign: TopDesign
  addOns: AddOnId[]
  rush: boolean
}

export interface Flavor {
  id: string
  name: string
  sponge: string
  cream: string
  accent: string
  priceMultiplier: number
}

export interface CoatingColor {
  id: string
  name: string
  hex: string
}

export interface CoatingFinish {
  id: CoatingFinishId
  name: string
  price: number
  blurb: string
}

export interface SideDesignDef {
  id: SideDesignId
  name: string
  price: number
  blurb: string
}

export interface TopDesignDef {
  id: TopDesignId
  name: string
  price: number
  blurb: string
  /** Approx. height added above the top ellipse, as a multiple of the top tier rx. */
  elevation: number
  candleCount?: boolean
  number?: boolean
}

export interface AddOnDef {
  id: AddOnId
  name: string
  price: number
  blurb: string
}

export interface PriceLine {
  id: string
  label: string
  amount: number
}

export interface Pricing {
  volumeIn3: number
  exposedAreaIn2: number
  weightKg: number
  servings: number
  leadTimeDays: number
  lines: PriceLine[]
  total: number
}

export interface CartPayload {
  id: string
  createdAt: string
  config: CakeConfig
  pricing: Pricing
}
