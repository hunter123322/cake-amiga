import type { CakeConfig, Pricing, PriceLine } from '~/types/cake'
import { getFlavor } from '~/data/flavors'
import { getCoatingFinish } from '~/data/coatings'
import { getSideDesign } from '~/data/sideDesigns'
import { getTopDesign } from '~/data/topDesigns'
import { ADD_ONS } from '~/data/addOns'

export const PRICING = {
  /** $ per cubic inch of cake. */
  baseVolumeRate: 0.06,
  /** $ per square inch of exposed surface. */
  baseAreaRate: 0.025,
  /** $ per cubic inch at flavor multiplier 1.0. */
  flavorVolumeRate: 0.008,
  /** $ per square inch to coat the exposed surface. */
  coatingAreaRate: 0.02,
  laborPerTier: 6,
  rushFee: 15,
  /** Roughly 0.5 g/cm³ — a frosted sponge cake. */
  densityKgPerIn3: 0.0082,
  /** Dessert servings of ~9 in³ each. */
  servingIn3: 9,
  leadBaseDays: 2,
} as const

const round2 = (n: number) => Math.round(n * 100) / 100

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount)
}

export function computePricing(config: CakeConfig): Pricing {
  const tiers = config.tiers
  let volume = 0
  let sideArea = 0
  const tierVolumes: number[] = []

  for (const tier of tiers) {
    const r = tier.diameterIn / 2
    const v = Math.PI * r * r * tier.heightIn
    tierVolumes.push(v)
    volume += v
    sideArea += 2 * Math.PI * r * tier.heightIn
  }
  const topTier = tiers[tiers.length - 1]
  const topArea = topTier ? Math.PI * (topTier.diameterIn / 2) ** 2 : 0
  const exposedArea = sideArea + topArea

  const flavorAmount = tierVolumes.reduce((sum, v, i) => {
    const flavor = getFlavor(tiers[i]?.flavorId ?? 'vanilla')
    return sum + v * PRICING.flavorVolumeRate * flavor.priceMultiplier
  }, 0)

  const finish = getCoatingFinish(config.coating.finish)
  const side = getSideDesign(config.sideDesign.id)
  const top = getTopDesign(config.topDesign.id)
  const addOnAmount = config.addOns.reduce(
    (sum, id) => sum + (ADD_ONS.find((a) => a.id === id)?.price ?? 0),
    0,
  )

  const lines: PriceLine[] = [
    {
      id: 'base',
      label: `Base cake (${tiers.length} ${tiers.length === 1 ? 'tier' : 'tiers'})`,
      amount: round2(PRICING.baseVolumeRate * volume + PRICING.baseAreaRate * exposedArea),
    },
    { id: 'flavors', label: 'Flavors', amount: round2(flavorAmount) },
    {
      id: 'coating',
      label: `Coating — ${finish.name}`,
      amount: round2(finish.price + PRICING.coatingAreaRate * exposedArea),
    },
    {
      id: 'side',
      label: `Side design — ${side.name}`,
      amount: round2(side.price),
    },
    { id: 'top', label: `Top design — ${top.name}`, amount: round2(top.price) },
    { id: 'extras', label: 'Extras', amount: round2(addOnAmount) },
    { id: 'labor', label: 'Decorating labor', amount: round2(tiers.length * PRICING.laborPerTier) },
  ]
  if (config.rush) {
    lines.push({ id: 'rush', label: 'Rush order', amount: PRICING.rushFee })
  }

  const total = round2(lines.reduce((sum, line) => sum + line.amount, 0))

  const weightKg = round2(volume * PRICING.densityKgPerIn3)
  const servings = Math.max(1, Math.floor(volume / PRICING.servingIn3))

  let leadTimeDays =
    PRICING.leadBaseDays +
    Math.ceil(tiers.length * 0.5) +
    (config.sideDesign.id === 'side-message' ? 1 : 0) +
    (config.topDesign.id !== 'top-none' ? 1 : 0)
  if (config.rush) leadTimeDays = Math.max(1, leadTimeDays - 2)

  return {
    volumeIn3: round2(volume),
    exposedAreaIn2: round2(exposedArea),
    weightKg,
    servings,
    leadTimeDays,
    lines,
    total,
  }
}
