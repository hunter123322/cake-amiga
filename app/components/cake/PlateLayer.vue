<script setup lang="ts">
import type { PlateGeometry } from '~/composables/useCakeGeometry'

const props = defineProps<{ plate: PlateGeometry }>()
</script>

<template>
  <g id="scenery">
    <title>Cake board</title>
    <ellipse
      :cx="props.plate.cx"
      :cy="props.plate.cy + 2"
      :rx="props.plate.rx * 1.05"
      :ry="props.plate.ry * 1.15"
      fill="#64748b"
      opacity="0.3"
      filter="url(#soft-shadow)"
    />
    <ellipse
      :cx="props.plate.cx"
      :cy="props.plate.cy"
      :rx="props.plate.rx"
      :ry="props.plate.ry"
      fill="url(#plate-shine)"
      stroke="#dbe3ee"
      stroke-width="1.5"
    />
    <ellipse
      :cx="props.plate.cx"
      :cy="props.plate.cy - 1"
      :rx="props.plate.rx * 0.86"
      :ry="props.plate.ry * 0.8"
      fill="none"
      stroke="#eef2f7"
      stroke-width="1.2"
    />
  </g>
</template>
