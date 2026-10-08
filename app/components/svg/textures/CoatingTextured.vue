<script setup lang="ts">
/** coating-textured — hand-swirled strokes at low opacity. */
const props = defineProps<{
  rx: number
  ry: number
  topY: number
  bottomY: number
  color: string
  seed?: string
}>()

const waves = computed(() => {
  const rand = seededRandom(`textured-${props.seed ?? 'x'}`)
  const { rx, ry, topY, bottomY } = props
  const rows = 5
  const list: Array<{ d: string; stroke: string; width: number; opacity: number }> = []
  for (let i = 0; i < rows; i++) {
    const y = topY + ry + ((bottomY - topY) * (i + 0.5)) / rows
    const amp = 4 + rand() * 5
    const len = rx * (1.1 + rand() * 0.6)
    const x0 = -rx * 0.9 + rand() * rx * 0.5
    const dark = i % 2 === 0
    list.push({
      d: `M ${x0.toFixed(1)} ${y.toFixed(1)} q ${(len * 0.25).toFixed(1)} ${-amp.toFixed(1)} ${(len * 0.5).toFixed(1)} 0 t ${(len * 0.5).toFixed(1)} 0`,
      stroke: dark ? darken(props.color, 14) : '#ffffff',
      width: 2.5 + rand() * 2,
      opacity: dark ? 0.16 : 0.22,
    })
  }
  return list
})
</script>

<template>
  <g id="coating-textured">
    <path
      v-for="(wave, i) in waves"
      :key="i"
      :d="wave.d"
      fill="none"
      :stroke="wave.stroke"
      :stroke-width="wave.width"
      stroke-linecap="round"
      :opacity="wave.opacity"
    />
  </g>
</template>
