<script setup lang="ts">
/** top-candles — 1–7 candles evenly spaced on the top ellipse. */
const props = defineProps<{
  color: string
  count?: number
  seed?: string
}>()

const candles = computed(() => {
  const rand = seededRandom(`candles-${props.seed ?? 'x'}`)
  const count = Math.min(7, Math.max(1, props.count ?? 5))
  const list: Array<{ x: number; y: number; h: number; w: number }> = []
  for (let i = 0; i < count; i++) {
    const deg = -90 + (i * 360) / count
    const t = (deg * Math.PI) / 180
    list.push({
      x: 50 + 38 * Math.cos(t),
      y: 100 + 7.6 * Math.sin(t),
      h: 30 + rand() * 8,
      w: 6.5 + rand() * 1.5,
    })
  }
  // painter's algorithm — back candles first
  return list.sort((a, b) => a.y - b.y)
})

const stripe = computed(() => darken(props.color, 14))
const glow = computed(() => lighten(props.color, 18))
</script>

<template>
  <g id="top-candles">
    <title>{{ candles.length }} candles</title>
    <ellipse :cx="50" :cy="101" :rx="34" :ry="7" fill="#000000" opacity="0.06" />
    <g v-for="(c, i) in candles" :key="i" :transform="`translate(${c.x.toFixed(1)} ${c.y.toFixed(1)})`">
      <ellipse :cx="0" :cy="1.5" :rx="c.w * 0.75" :ry="2.2" fill="#000000" opacity="0.14" />
      <rect
        :x="-c.w / 2"
        :y="-c.h"
        :width="c.w"
        :height="c.h"
        :rx="c.w * 0.35"
        :fill="props.color"
        :stroke="stripe"
        stroke-width="0.6"
        stroke-opacity="0.55"
      />
      <line :x1="-c.w * 0.18" :y1="-c.h + 3" :x2="-c.w * 0.18" :y2="-4" :stroke="glow" stroke-width="1" opacity="0.75" />
      <line x1="0" :y1="-c.h - 4" x2="0" :y2="-c.h" stroke="#6b4a2f" stroke-width="1.2" />
      <ellipse
        cx="0"
        :cy="-c.h - 8"
        rx="3.4"
        ry="5"
        fill="url(#flame-grad)"
        class="animate-flicker"
        style="transform-box: fill-box; transform-origin: 50% 100%"
      />
      <circle cx="0" :cy="-c.h - 8" r="7" fill="#ffd166" opacity="0.18" />
    </g>
  </g>
</template>
