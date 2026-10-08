import type { CakeConfig, Tier } from '~/types/cake'

export const TIER_LIMITS = {
  countMin: 1,
  countMax: 5,
  heightMin: 4,
  heightMax: 10,
  diameterMin: 8,
  diameterMax: 12,
  totalHeightWarnIn: 30,
  messageMaxLength: 30,
} as const

export interface ValidationResult {
  warnings: string[]
  errors: string[]
  stability: number
  isValid: boolean
}

export const clampHeight = (value: number) =>
  Math.min(TIER_LIMITS.heightMax, Math.max(TIER_LIMITS.heightMin, value))

export const clampDiameter = (value: number) =>
  Math.min(TIER_LIMITS.diameterMax, Math.max(TIER_LIMITS.diameterMin, value))

/**
 * Stability score 0-100 — penalises slenderness (tall stack on a small base)
 * and abrupt jumps in tier width.
 */
export function computeStability(tiers: Tier[]): number {
  const base = tiers[0]
  if (!base) return 0
  const totalHeight = tiers.reduce((sum, t) => sum + t.heightIn, 0)
  const slenderness = totalHeight / base.diameterIn
  let score = 100
  if (slenderness > 1.2) score -= (slenderness - 1.2) * 45
  for (let i = 1; i < tiers.length; i++) {
    const tier = tiers[i]
    const below = tiers[i - 1]
    if (!tier || !below) continue
    const ratio = tier.diameterIn / below.diameterIn
    if (ratio < 0.55) score -= (0.55 - ratio) * 40
  }
  return Math.round(Math.max(5, Math.min(100, score)))
}

export function validateCake(config: CakeConfig): ValidationResult {
  const warnings: string[] = []
  const errors: string[] = []
  const tiers = config.tiers

  if (tiers.length < TIER_LIMITS.countMin || tiers.length > TIER_LIMITS.countMax) {
    errors.push(`A cake needs between ${TIER_LIMITS.countMin} and ${TIER_LIMITS.countMax} tiers.`)
  }

  tiers.forEach((tier, i) => {
    if (tier.heightIn < TIER_LIMITS.heightMin || tier.heightIn > TIER_LIMITS.heightMax) {
      errors.push(`Tier ${i + 1} height must be between 4 and 10 inches.`)
    }
    if (tier.diameterIn < TIER_LIMITS.diameterMin || tier.diameterIn > TIER_LIMITS.diameterMax) {
      errors.push(`Tier ${i + 1} diameter must be between 8 and 12 inches.`)
    }
    if (i > 0) {
      const below = tiers[i - 1]
      if (below && tier.diameterIn > below.diameterIn) {
        errors.push(
          `Tier ${i + 1} is wider than the tier below it — upper tiers were auto-shrunk to fit.`,
        )
      }
    }
  })

  const totalHeight = tiers.reduce((sum, t) => sum + t.heightIn, 0)
  if (totalHeight > TIER_LIMITS.totalHeightWarnIn) {
    warnings.push(`This stack is ${totalHeight} in tall — over our ${TIER_LIMITS.totalHeightWarnIn} in display limit.`)
  }

  const stability = computeStability(tiers)
  if (stability < 60 && tiers.length > 1) {
    warnings.push('Top-heavy design — add a wider base tier or reduce heights for a sturdier stack.')
  }

  if (!config.coating.color) {
    errors.push('Pick a coating colour before checking out.')
  }

  if (config.sideDesign.message.length > TIER_LIMITS.messageMaxLength) {
    errors.push(`Messages are limited to ${TIER_LIMITS.messageMaxLength} characters.`)
  }
  if (/[<>]/.test(config.sideDesign.message)) {
    errors.push('Messages cannot contain < or > characters.')
  }

  return { warnings, errors, stability, isValid: errors.length === 0 }
}

/** Strip characters we never want on a cake, then clamp to the max length. */
export function sanitizeMessage(raw: string): string {
  return raw.replace(/[<>&]/g, '').slice(0, TIER_LIMITS.messageMaxLength)
}
