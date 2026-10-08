<script setup lang="ts">
/** top-fruit — strawberries and blueberries arranged on the rim. */
const props = defineProps<{
  color: string
  seed?: string
}>()

const berries = computed(() => {
  const rand = seededRandom(`fruit-${props.seed ?? 'x'}`)
  const strawberries = [150, 30, 270].map((deg) => {
    const t = (deg * Math.PI) / 180
    return {
      kind: 'strawberry' as const,
      x: 50 + 37 * Math.cos(t),
      y: 100 + 8 * Math.sin(t),
      s: 1 + rand() * 0.18,
    }
  })
  const blueberries = [90, 190, 350, 60, 240].map((deg) => {
    const t = (deg * Math.PI) / 180
    return {
      kind: 'blueberry' as const,
      x: 50 + 43 * Math.cos(t),
      y: 100 + 9.2 * Math.sin(t),
      s: 0.9 + rand() * 0.25,
    }
  })
  return [...strawberries, ...blueberries].sort((a, b) => a.y - b.y)
})

const leafColor = '#4d7c46'
</script>

<template>
  <g id="top-fruit">
    <title>Berry crown</title>
    <ellipse :cx="50" :cy="101" :rx="36" :ry="7.5" fill="#000000" opacity="0.07" />
    <g
      v-for="(b, i) in berries"
      :key="i"
      :transform="`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) scale(${b.s.toFixed(2)})`"
    >
      <template v-if="b.kind === 'strawberry'">
        <ellipse :cy="8.5" :rx="8" :ry="2.4" fill="#000000" opacity="0.15" />
        <path
          d="M 0 -7 q 7.5 2.6 7.5 8.6 q 0 7.6 -7.5 11.4 q -7.5 -3.8 -7.5 -11.4 q 0 -6 7.5 -8.6 Z"
          fill="#d93a4a"
          stroke="#a82334"
          stroke-width="0.8"
        />
        <circle cx="-2.4" cy="1" r="0.9" fill="#ffe1a8" />
        <circle cx="1.6" cy="3.4" r="0.9" fill="#ffe1a8" />
        <circle cx="-0.6" cy="6.6" r="0.9" fill="#ffe1a8" />
        <circle cx="3.4" cy="-1.6" r="0.9" fill="#ffe1a8" />
        <ellipse cx="-2.6" cy="-1.4" rx="2.2" ry="3.4" fill="#ffffff" opacity="0.3" />
        <path d="M 0 -7 l -5 -3.6 l 3 0.8 l 2 -2.6 l 2 2.6 l 3 -0.8 Z" :fill="leafColor" />
      </template>
      <template v-else>
        <circle cy="5" r="4.6" fill="#000000" opacity="0.12" />
        <circle r="4.6" fill="#4f63a8" stroke="#3a4c88" stroke-width="0.7" />
        <path d="M 0 -3.6 l 0.9 2.2 2.2 0.9 -2.2 0.9 -0.9 2.2 -0.9 -2.2 -2.2 -0.9 2.2 -0.9 Z" fill="#98a9dd" />
      </template>
    </g>
  </g>
</template>
