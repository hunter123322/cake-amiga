<script setup lang="ts">
/** top-topper-number — a milestone number in a disc on a stick. */
const props = defineProps<{
  color: string
  number?: string
  seed?: string
}>()

const label = computed(() => (props.number ?? '1').slice(0, 2) || '1')
const ink = computed(() => contrastText(props.color))
const edge = computed(() => darken(props.color, 16))
const glow = computed(() => lighten(props.color, 20))
const stick = computed(() => mix(props.color, '#64748b', 0.3))
</script>

<template>
  <g id="top-topper-number">
    <title>Number {{ label }} topper</title>
    <ellipse :cx="50" :cy="101" :rx="15" :ry="3" fill="#000000" opacity="0.08" />
    <rect x="48.4" y="42" width="3.2" height="58" :fill="stick" />
    <circle cx="50" cy="38" r="21" :fill="props.color" :stroke="edge" stroke-width="1.4" />
    <circle cx="50" cy="38" r="17" fill="none" :stroke="glow" stroke-width="1.4" opacity="0.8" />
    <text
      x="50"
      :y="label.length > 1 ? 45.5 : 47"
      text-anchor="middle"
      :fill="ink"
      :font-size="label.length > 1 ? 20 : 26"
      font-family="Georgia, 'Times New Roman', serif"
      font-weight="700"
    >{{ label }}</text>
  </g>
</template>
