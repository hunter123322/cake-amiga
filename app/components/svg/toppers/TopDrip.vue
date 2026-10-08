<script setup lang="ts">
/** top-drip — a chocolate drip crown with a sprinkle confetti. */
const props = defineProps<{
  color: string
  seed?: string
}>()

/**
 * Local frame: the top ellipse is centred at (50, 100) with rx 50 / ry 10.
 * The glaze matches it exactly (plus a hair) so the crown sits flush on the cake top.
 */
const GLAZE_RX = 50.3
const GLAZE_RY = 10.06

const drips = computed(() => {
  const rand = seededRandom(`topdrip-${props.seed ?? 'x'}`)
  const n = 7
  const list: string[] = []
  for (const { a, b } of rimSegments(GLAZE_RX, GLAZE_RY, 100, n + 1, 0.99, 50)) {
    const depth = 6 + rand() * 9
    const midX = (a.x + b.x) / 2
    const midY = Math.max(a.y, b.y) + depth
    const ctrlY = 2 * midY - (a.y + b.y) / 2
    list.push(
      `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${midX.toFixed(1)} ${ctrlY.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)} Q ${midX.toFixed(1)} ${ctrlY.toFixed(1)} ${a.x.toFixed(1)} ${a.y.toFixed(1)} Z`,
    )
  }
  return list
})

const sprinkles = computed(() => {
  const rand = seededRandom(`topsprinkles-${props.seed ?? 'x'}`)
  const palette = ['#ff6fa5', '#5ec8f0', '#ffd166', '#7bd88f', '#b388f0', '#ff9f68']
  const list: Array<{ x: number; y: number; rot: number; fill: string }> = []
  for (let i = 0; i < 14; i++) {
    const t = rand() * Math.PI * 2
    const rad = Math.sqrt(rand())
    list.push({
      x: 50 + Math.cos(t) * rad * 34,
      y: 100 + Math.sin(t) * rad * 6.6,
      rot: Math.round(rand() * 360),
      fill: palette[Math.floor(rand() * palette.length)] ?? '#ffd166',
    })
  }
  return list
})

const glaze = computed(() => lighten(props.color, 10))
const shine = computed(() => lighten(props.color, 26))
const edge = computed(() => darken(props.color, 18))
</script>

<template>
  <g id="top-drip">
    <title>Chocolate drip crown</title>
    <ellipse cx="50" cy="100" :rx="GLAZE_RX" :ry="GLAZE_RY" :fill="glaze" :stroke="edge" stroke-width="1" />
    <path
      v-for="(s, i) in sprinkles"
      :key="`sp-${i}`"
      :d="`M ${s.x} ${s.y - 2.6} l 1.1 1.7 1.9 0.5 -1.4 1.4 0.3 2 -1.9 -1 -1.9 1 0.3 -2 -1.4 -1.4 1.9 -0.5 Z`"
      :fill="s.fill"
      opacity="0.95"
      :transform="`rotate(${s.rot} ${s.x.toFixed(1)} ${s.y.toFixed(1)})`"
    />
    <ellipse cx="36" cy="96.5" rx="9" ry="2.8" :fill="shine" opacity="0.5" />
    <ellipse cx="62" cy="102.6" rx="7" ry="2.2" :fill="shine" opacity="0.32" />
    <path
      v-for="(d, i) in drips"
      :key="`drip-${i}`"
      :d="d"
      :fill="props.color"
      :stroke="edge"
      stroke-width="0.7"
      stroke-opacity="0.5"
    />
  </g>
</template>
