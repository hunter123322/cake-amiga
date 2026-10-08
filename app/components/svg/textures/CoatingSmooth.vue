<script setup lang="ts">
/**
 * coating-smooth — flat fill with a subtle highlight along the top rim.
 * The body fill itself is painted by TierLayer; this only adds gloss.
 */
const props = defineProps<{
  rx: number
  ry: number
  topY: number
  bottomY: number
  color: string
  seed?: string
}>()

const rimHighlight = computed(() => {
  const { rx, ry, topY } = props
  const a = { x: rx * 0.97 * Math.cos(Math.PI * 0.78), y: topY + ry * 0.97 * Math.sin(Math.PI * 0.78) }
  const b = { x: rx * 0.97 * Math.cos(Math.PI * 0.34), y: topY + ry * 0.97 * Math.sin(Math.PI * 0.34) }
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q 0 ${(topY + ry * 1.15).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
})
</script>

<template>
  <g id="coating-smooth">
    <path
      :d="rimHighlight"
      fill="none"
      stroke="#ffffff"
      stroke-width="4"
      stroke-linecap="round"
      opacity="0.35"
    />
  </g>
</template>
