<script setup lang="ts">
/**
 * top-flowers — a ring of piped roses with leaves.
 * Local frame: top ellipse is centred at (50, 100) with rx 50 / ry 10.
 */
const props = defineProps<{
  color: string
  leafColor?: string
  seed?: string
}>()

const leaf = computed(() => props.leafColor ?? '#4d7c46')

const roses = computed(() => {
  const rand = seededRandom(`roses-${props.seed ?? 'x'}`)
  const angles = [30, 120, 210, 300]
  return angles.map((deg, i) => {
    const t = (deg * Math.PI) / 180
    return {
      x: 50 + 36 * Math.cos(t),
      y: 100 + 8 * Math.sin(t),
      r: 11 + rand() * 3 + (i % 2 === 0 ? 1 : 0),
    }
  })
})

const leaves = computed(() => {
  const angles = [75, 165, 255, 345, 15, 195]
  return angles.map((deg) => {
    const t = (deg * Math.PI) / 180
    return {
      x: 50 + 43 * Math.cos(t),
      y: 100 + 9.4 * Math.sin(t),
      rot: deg + 90,
    }
  })
})

const petal = computed(() => darken(props.color, 12))
const petalDeep = computed(() => darken(props.color, 22))
const petalLight = computed(() => lighten(props.color, 10))
const leafShade = computed(() => darken(leaf.value, 18))
</script>

<template>
  <g id="top-flowers">
    <title>Ring of piped roses</title>
    <ellipse :cx="50" :cy="101" :rx="38" :ry="8" fill="#000000" opacity="0.07" />
    <!-- leaves behind the roses -->
    <ellipse
      v-for="(l, i) in leaves"
      :key="`leaf-${i}`"
      :cx="l.x"
      :cy="l.y"
      :rx="9"
      :ry="4"
      :fill="leaf"
      :stroke="leafShade"
      stroke-width="0.8"
      :transform="`rotate(${l.rot} ${l.x} ${l.y})`"
    />
    <g v-for="(rose, i) in roses" :key="`rose-${i}`" :transform="`translate(${rose.x.toFixed(1)} ${rose.y.toFixed(1)})`">
      <circle :r="rose.r" :fill="petalLight" :stroke="petalDeep" stroke-width="1" />
      <path
        :d="`M ${-rose.r * 0.66} ${rose.r * 0.12} a ${rose.r * 0.66} ${rose.r * 0.66} 0 1 1 ${rose.r * 1.32} 0`"
        fill="none"
        :stroke="petal"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        :d="`M ${-rose.r * 0.42} ${rose.r * 0.08} a ${rose.r * 0.42} ${rose.r * 0.42} 0 1 1 ${rose.r * 0.84} 0`"
        fill="none"
        :stroke="petalDeep"
        stroke-width="1.4"
        stroke-linecap="round"
      />
      <circle :r="rose.r * 0.16" :fill="petalDeep" />
    </g>
  </g>
</template>
