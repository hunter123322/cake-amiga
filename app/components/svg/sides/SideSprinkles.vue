<script setup lang="ts">
/** side-sprinkles — seeded scatter of confetti sprinkles. */
const props = defineProps<{
  rx: number
  ry: number
  topY: number
  bottomY: number
  color: string
  seed?: string
}>()

const sprinkles = computed(() => {
  const rand = seededRandom(`sprinkles-${props.seed ?? 'x'}`)
  const { rx, ry, topY, bottomY, color } = props
  const palette = [
    color,
    lighten(color, 20),
    darken(color, 14),
    mix(color, '#ffffff', 0.55),
    mix(color, '#334155', 0.7),
  ]
  const count = 26
  const list: Array<{ x: number; y: number; rot: number; w: number; h: number; fill: string }> = []
  for (let i = 0; i < count; i++) {
    const x = -rx * 0.92 + rand() * rx * 1.84
    const y = topY + ry * 1.2 + rand() * (bottomY - topY)
    list.push({
      x,
      y,
      rot: Math.round(rand() * 360),
      w: 2.2 + rand() * 1.2,
      h: 6 + rand() * 3.5,
      fill: palette[Math.floor(rand() * palette.length)] ?? color,
    })
  }
  return list
})
</script>

<template>
  <g id="side-sprinkles">
    <title>Confetti sprinkles</title>
    <rect
      v-for="(s, i) in sprinkles"
      :key="i"
      :x="s.x - s.w / 2"
      :y="s.y - s.h / 2"
      :width="s.w"
      :height="s.h"
      :rx="s.w / 2"
      :fill="s.fill"
      :transform="`rotate(${s.rot} ${s.x.toFixed(1)} ${s.y.toFixed(1)})`"
    />
  </g>
</template>
