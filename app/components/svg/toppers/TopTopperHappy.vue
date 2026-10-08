<script setup lang="ts">
/** top-topper-happy — a standing "Happy Birthday" sign. */
const props = defineProps<{
  color: string
  seed?: string
}>()

const ink = computed(() => contrastText(props.color))
const edge = computed(() => darken(props.color, 16))
const stick = computed(() => mix(props.color, '#64748b', 0.3))
</script>

<template>
  <g id="top-topper-happy">
    <title>Happy Birthday sign</title>
    <ellipse :cx="50" :cy="101" :rx="17" :ry="3.4" fill="#000000" opacity="0.08" />
    <rect x="43.5" y="34" width="2.6" height="66" :fill="stick" />
    <rect x="54" y="34" width="2.6" height="66" :fill="stick" />
    <rect x="18" y="20" width="64" height="32" rx="11" :fill="props.color" :stroke="edge" stroke-width="1.2" />
    <rect
      x="21.5"
      y="23.5"
      width="57"
      height="25"
      rx="8"
      fill="none"
      :stroke="ink"
      stroke-width="0.8"
      opacity="0.35"
    />
    <text
      x="50"
      y="40.5"
      text-anchor="middle"
      :fill="ink"
      font-size="10.5"
      font-family="Georgia, 'Times New Roman', serif"
      font-weight="700"
      letter-spacing="0.4"
      textLength="52"
      lengthAdjust="spacingAndGlyphs"
    >Happy Birthday</text>
    <path d="M 26 26 l 1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6 Z" :fill="ink" opacity="0.75" />
    <path d="M 74 26 l 1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6 Z" :fill="ink" opacity="0.75" />
  </g>
</template>
