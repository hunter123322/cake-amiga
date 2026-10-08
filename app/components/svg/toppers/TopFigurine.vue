<script setup lang="ts">
/** top-figurine — a simple character silhouette. */
const props = defineProps<{
  color: string
  seed?: string
}>()

const ink = computed(() => contrastText(props.color))
const crown = computed(() => mix(props.color, '#f5c542', 0.62))
const blush = computed(() => lighten(props.color, 24))
</script>

<template>
  <g id="top-figurine">
    <title>Cake figurine</title>
    <ellipse :cx="50" :cy="101" :rx="16" :ry="3.2" fill="#000000" opacity="0.1" />
    <rect x="37" y="62" width="26" height="34" rx="12" :fill="props.color" />
    <circle :cx="36" :cy="76" r="5" :fill="props.color" />
    <circle :cx="64" :cy="76" r="5" :fill="props.color" />
    <circle cx="50" cy="49" r="14" :fill="props.color" />
    <path
      d="M 38 42 l 2 -8 l 4.5 4 l 5.5 -6.5 l 5.5 6.5 l 4.5 -4 l 2 8 q -12 5 -24 0 Z"
      :fill="crown"
      stroke="#c9962f"
      stroke-width="0.7"
    />
    <circle cx="44.5" cy="50" r="1.7" :fill="ink" />
    <circle cx="55.5" cy="50" r="1.7" :fill="ink" />
    <path d="M 45.5 55.5 q 4.5 4 9 0" fill="none" :stroke="ink" stroke-width="1.4" stroke-linecap="round" />
    <circle cx="40.5" cy="54.5" r="2.6" :fill="blush" opacity="0.85" />
    <circle cx="59.5" cy="54.5" r="2.6" :fill="blush" opacity="0.85" />
    <circle cx="50" cy="89" r="1.6" :fill="blush" />
    <circle cx="43" cy="86" r="1.4" :fill="blush" opacity="0.8" />
    <circle cx="57" cy="86" r="1.4" :fill="blush" opacity="0.8" />
  </g>
</template>
