<script setup lang="ts">
/** side-pearls — a horizontal band of sugar pearls on a thin rope. */
const props = defineProps<{
  rx: number
  ry: number
  topY: number
  bottomY: number
  color: string
  seed?: string
}>()

const band = computed(() => {
  const midY = (props.topY + props.bottomY) / 2 + props.ry * 0.5
  const n = Math.max(8, Math.round(props.rx / 7))
  const pts = frontRimPoints(props.rx, props.ry * 0.55, midY, n, 0.9)
  const r = Math.max(2.4, props.rx * 0.05)
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  return { pts, r, line, midY }
})

const highlight = computed(() => lighten(props.color, 20))
const edge = computed(() => darken(props.color, 12))
</script>

<template>
  <g id="side-pearls">
    <title>Pearl band</title>
    <path :d="band.line" fill="none" :stroke="edge" stroke-width="1.6" opacity="0.4" />
    <circle
      v-for="(p, i) in band.pts"
      :key="i"
      :cx="p.x"
      :cy="p.y"
      :r="band.r"
      :fill="props.color"
      :stroke="edge"
      stroke-width="0.6"
      stroke-opacity="0.35"
    />
    <circle
      v-for="(p, i) in band.pts"
      :key="`hl-${i}`"
      :cx="p.x - band.r * 0.3"
      :cy="p.y - band.r * 0.32"
      :r="band.r * 0.34"
      :fill="highlight"
      opacity="0.85"
    />
  </g>
</template>
