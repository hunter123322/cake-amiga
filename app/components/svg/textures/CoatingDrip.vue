<script setup lang="ts">
/**
 * coating-drip
 *
 * Iconic dripping-icing overlay.
 *
 * - A solid coating band sits across the top.
 * - Thin uniform-width strands hang from it, each ending in a rounded
 *   semicircle tip (no flared neck — this is what makes it read as the
 *   flat "drip" icon instead of realistic icing).
 * - Between strands the coating edge sags in a soft U-scallop.
 * - A few strands spawn a detached teardrop below: round bulb at the
 *   bottom, tapered point rising above it.
 */

const props = defineProps<{
  rx: number
  ry: number
  topY: number
  bottomY: number
  color: string
  seed?: string
}>()

type Drip = { x: number; halfW: number; tipY: number }
type Drop = { cx: number; cy: number; r: number }

const n = (v: number) => v.toFixed(2)

const coating = computed(() => {
  const rand = seededRandom(`coating-drip:${props.seed ?? 'default'}`)
  const { rx, ry, topY, bottomY } = props

  /* ---------- band ---------- */

  // Solid rectangle at the top. Slight overlap above topY so the coating
  // reads as sitting *on* the cake rim rather than floating above it.
  const bandTopY = topY - Math.max(1, ry * 0.06)
  const bandBottomY = topY + Math.max(3, ry * 0.14)

  const maxReach = Math.max(6, bottomY - 2 - bandBottomY)

  /* ---------- layout ---------- */

  const drips: Drip[] = []
  const drops: Drop[] = []

  const limit = rx * 0.96
  let cursor = -limit + rx * 0.05

  while (cursor < limit) {
    // slight perspective: drips nearer the viewer are marginally wider
    const persp = 0.9 + 0.2 * (1 - (cursor / rx) ** 2)

    // Uniform strand width — the icon's drips do NOT taper.
    const halfW = Math.max(0.7, rx * (0.022 + rand() * 0.016) * persp)

    const roll = rand()
    const factor =
      roll < 0.22 ? 0.72 + rand() * 0.28
      : roll < 0.55 ? 0.38 + rand() * 0.32
      : 0.12 + rand() * 0.26

    const depth = Math.max(2, Math.min(maxReach * factor, maxReach))
    const x = cursor + halfW
    if (x + halfW > limit) break

    const tipY = bandBottomY + depth
    drips.push({ x, halfW, tipY })

    // Detached droplet below longer drips
    if (roll < 0.22 && depth > maxReach * 0.45) {
      const r = halfW * (1.0 + rand() * 0.5)
      const gap = r * (1.5 + rand() * 1.6)
      const cy = tipY + gap + r
      if (cy + r < bottomY - 1) {
        drops.push({ cx: x, cy, r })
      }
    }

    // gap between strands — wide enough to be visible, tight enough to
    // read as one coating
    cursor = x + halfW + halfW * (2.5 + rand() * 4)
  }

  /* ---------- path ---------- */

  const segs: string[] = [
    `M ${n(-rx)} ${n(bandTopY)}`,
    `L ${n(-rx)} ${n(bandBottomY)}`,
  ]

  // a soft U-scallop between two drips: dips slightly below the band
  const scallop = (fromX: number, toX: number) => {
    const span = toX - fromX
    if (span < 0.6) return `L ${n(toX)} ${n(bandBottomY)}`
    const sag = Math.min(span * 0.16, ry * 0.07)
    const c1 = fromX + span * 0.3
    const c2 = fromX + span * 0.7
    return (
      `C ${n(c1)} ${n(bandBottomY + sag)}, ` +
      `${n(c2)} ${n(bandBottomY + sag)}, ` +
      `${n(toX)} ${n(bandBottomY)}`
    )
  }

  let prevX = -rx
  for (const drip of drips) {
    const xL = drip.x - drip.halfW
    const xR = drip.x + drip.halfW
    const neckY = drip.tipY - drip.halfW // top of the rounded tip

    segs.push(scallop(prevX, xL))

    // strand: straight down, semicircle, straight back up
    segs.push(`L ${n(xL)} ${n(neckY)}`)
    segs.push(
      `A ${n(drip.halfW)} ${n(drip.halfW)} 0 0 0 ${n(xR)} ${n(neckY)}`
    )
    segs.push(`L ${n(xR)} ${n(bandBottomY)}`)

    prevX = xR
  }
  segs.push(scallop(prevX, rx))

  segs.push(`L ${n(rx)} ${n(bandTopY)}`)
  segs.push('Z')

  /* ---------- detached teardrops ---------- */

  const dropPaths = drops.map(({ cx, cy, r }) => {
    const tipY = cy - r * 2
    return [
      `M ${n(cx)} ${n(tipY)}`,
      `C ${n(cx - r * 0.15)} ${n(cy - r * 1.3)}, ` +
        `${n(cx - r * 0.9)} ${n(cy - r * 0.6)}, ` +
        `${n(cx - r)} ${n(cy)}`,
      `A ${n(r)} ${n(r)} 0 0 0 ${n(cx + r)} ${n(cy)}`,
      `C ${n(cx + r * 0.9)} ${n(cy - r * 0.6)}, ` +
        `${n(cx + r * 0.15)} ${n(cy - r * 1.3)}, ` +
        `${n(cx)} ${n(tipY)}`,
      'Z',
    ].join(' ')
  })

  return {
    path: segs.join(' '),
    dropPaths,
    colors: {
      base: props.color,
      dark: darken(props.color, 24),
      darker: darken(props.color, 40),
      light: lighten(props.color, 12),
    },
  }
})

const uid = computed(
  () => String(props.seed ?? 'x').replace(/[^a-zA-Z0-9_-]/g, '') || 'x'
)
const coatingId = computed(() => `coating-${uid.value}`)
</script>

<template>
  <g id="coating-drip">
    <defs>
      <!-- very subtle vertical shading so it doesn't look dead flat -->
      <linearGradient :id="coatingId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="coating.colors.light" />
        <stop offset="55%" :stop-color="coating.colors.base" />
        <stop offset="100%" :stop-color="coating.colors.dark" />
      </linearGradient>
    </defs>

    <!-- coating band + attached strands -->
    <path :d="coating.path" :fill="`url(#${coatingId})`" />

    <!-- detached teardrops -->
    <path
      v-for="(d, i) in coating.dropPaths"
      :key="`drop-${i}`"
      :d="d"
      :fill="`url(#${coatingId})`"
    />
  </g>
</template>