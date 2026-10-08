<script setup lang="ts">
/** coating-rustic — a half-frosted look with spatula sweep marks. */
const props = defineProps<{
  rx: number
  ry: number
  topY: number
  bottomY: number
  color: string
  seed?: string
}>()

const sweeps = computed(() => {
  const rand = seededRandom(`rustic-${props.seed ?? 'x'}`)
  const { rx, ry, topY, bottomY } = props
  const rows = 6
  const list: Array<{ d: string; stroke: string; width: number; opacity: number }> = []
  for (let i = 0; i < rows; i++) {
    const y = topY + ry + ((bottomY - topY) * (i + 0.5)) / rows
    const w = rx * (0.5 + rand() * 0.8)
    const x0 = -rx * 0.9 + rand() * (rx * 1.8 - w)
    const amp = 5 + rand() * 6
    list.push({
      d: `M ${x0.toFixed(1)} ${y.toFixed(1)} Q ${(x0 + w / 2).toFixed(1)} ${(y - amp).toFixed(1)} ${(x0 + w).toFixed(1)} ${y.toFixed(1)}`,
      stroke: lighten(props.color, 7),
      width: 5 + rand() * 3,
      opacity: 0.55,
    })
    list.push({
      d: `M ${(x0 + 2).toFixed(1)} ${(y + 2.5).toFixed(1)} Q ${(x0 + w / 2).toFixed(1)} ${(y - amp + 2.5).toFixed(1)} ${(x0 + w).toFixed(1)} ${(y + 2.5).toFixed(1)}`,
      stroke: darken(props.color, 12),
      width: 2,
      opacity: 0.22,
    })
  }
  return list
})
</script>

<template>
  <g id="coating-rustic">
    <path
      v-for="(sweep, i) in sweeps"
      :key="i"
      :d="sweep.d"
      fill="none"
      :stroke="sweep.stroke"
      :stroke-width="sweep.width"
      stroke-linecap="round"
      :opacity="sweep.opacity"
    />
  </g>
</template>
