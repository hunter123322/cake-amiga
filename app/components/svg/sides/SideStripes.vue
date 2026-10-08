<script setup lang="ts">
/** side-stripes — vertical candy stripes. */
const props = defineProps<{
  rx: number
  ry: number
  topY: number
  bottomY: number
  color: string
  seed?: string
}>()

const stripes = computed(() => {
  const { rx, ry, topY, bottomY } = props
  const n = 6
  const span = rx * 1.5
  const w = span / (n * 2 - 1)
  const y0 = topY + ry * 0.35
  const h = bottomY + ry * 0.95 - y0
  const list: Array<{ x: number; w: number; y: number; h: number }> = []
  for (let i = 0; i < n; i++) {
    const cx = -span / 2 + w / 2 + i * w * 2
    list.push({ x: cx - w / 2, w, y: y0, h })
  }
  return list
})
</script>

<template>
  <g id="side-stripes">
    <title>Vertical stripes</title>
    <rect
      v-for="(stripe, i) in stripes"
      :key="i"
      :x="stripe.x"
      :y="stripe.y"
      :width="stripe.w"
      :height="stripe.h"
      :rx="stripe.w / 2"
      :fill="props.color"
      opacity="0.92"
    />
  </g>
</template>
