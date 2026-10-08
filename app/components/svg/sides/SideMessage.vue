<script setup lang="ts">
/** side-message — piped lettering (system font, squeezed with textLength). */
const props = defineProps<{
  rx: number
  ry: number
  topY: number
  bottomY: number
  color: string
  message?: string
  seed?: string
}>()

const text = computed(() => (props.message ?? '').trim())

const layout = computed(() => {
  const fontSize = Math.min(props.rx * 0.26, 30)
  const y = (props.topY + props.bottomY) / 2 + props.ry * 0.7 + fontSize * 0.35
  const natural = text.value.length * fontSize * 0.58
  const textLength = Math.min(props.rx * 1.55, natural)
  return { fontSize, y, textLength }
})

const shade = computed(() => darken(props.color, 12))
const glow = computed(() => lighten(props.color, 14))
</script>

<template>
  <g v-if="text" id="side-message">
    <title>Cake message: {{ text }}</title>
    <text
      x="0"
      :y="layout.y"
      text-anchor="middle"
      :fill="props.color"
      :stroke="glow"
      :stroke-width="layout.fontSize * 0.14"
      paint-order="stroke"
      stroke-linejoin="round"
      :font-size="layout.fontSize"
      font-family="Georgia, 'Times New Roman', serif"
      font-weight="600"
      :textLength="layout.textLength"
      lengthAdjust="spacingAndGlyphs"
    >{{ text }}</text>
    <path
      :d="`M ${-props.rx * 0.34} ${layout.y + layout.fontSize * 0.5} q ${props.rx * 0.17} ${layout.fontSize * 0.32} ${props.rx * 0.34} 0 q ${props.rx * 0.17} ${-layout.fontSize * 0.32} ${props.rx * 0.34} 0`"
      fill="none"
      :stroke="shade"
      stroke-width="1.6"
      stroke-linecap="round"
      opacity="0.5"
    />
  </g>
</template>
