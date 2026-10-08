<script setup lang="ts">
/** side-piping-dots — a row of buttercream pearls along the bottom rim. */
const props = defineProps<{
  rx: number
  ry: number
  topY: number
  bottomY: number
  color: string
  seed?: string
}>()

const dots = computed(() => {
  const n = Math.max(7, Math.round(props.rx / 6))
  const r = Math.max(2.6, props.rx * 0.055)
  return frontRimPoints(props.rx, props.ry, props.bottomY, n, 0.92).map((p) => ({
    cx: p.x,
    cy: p.y - 7 - r,
    r,
  }))
})

const highlight = computed(() => lighten(props.color, 20))
const edge = computed(() => darken(props.color, 12))
</script>

<template>
  <g id="side-piping-dots">
    <title>Piped pearl border</title>
    <circle
      v-for="(dot, i) in dots"
      :key="i"
      :cx="dot.cx"
      :cy="dot.cy"
      :r="dot.r"
      :fill="props.color"
      :stroke="edge"
      stroke-width="0.6"
      stroke-opacity="0.35"
    />
    <circle
      v-for="(dot, i) in dots"
      :key="`hl-${i}`"
      :cx="dot.cx - dot.r * 0.3"
      :cy="dot.cy - dot.r * 0.32"
      :r="dot.r * 0.34"
      :fill="highlight"
      opacity="0.85"
    />
  </g>
</template>
