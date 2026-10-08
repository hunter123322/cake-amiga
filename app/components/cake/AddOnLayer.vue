<script setup lang="ts">
import type { AddOnId } from '~/types/cake'
import type { PlateGeometry } from '~/composables/useCakeGeometry'

const props = defineProps<{
  plate: PlateGeometry
  addOns: AddOnId[]
}>()

interface Item {
  kind: AddOnId
  x: number
  y: number
  scale: number
  rotate: number
}

const items = computed<Item[]>(() => {
  const baseY = props.plate.cy + props.plate.ry * 0.55
  const rx = props.plate.rx
  const list: Item[] = []
  if (props.addOns.includes('addon-plates')) {
    list.push({ kind: 'addon-plates', x: -(rx + 40), y: baseY, scale: 0.78, rotate: 0 })
  }
  if (props.addOns.includes('addon-card')) {
    list.push({ kind: 'addon-card', x: -rx * 0.72, y: baseY + 8, scale: 0.55, rotate: -7 })
  }
  if (props.addOns.includes('addon-knife')) {
    list.push({ kind: 'addon-knife', x: rx + 36, y: baseY, scale: 0.8, rotate: 6 })
  }
  if (props.addOns.includes('addon-box')) {
    list.push({ kind: 'addon-box', x: rx + 104, y: baseY, scale: 0.85, rotate: 0 })
  }
  return list
})

const transformFor = (item: Item) =>
  `translate(${item.x.toFixed(1)} ${item.y.toFixed(1)}) rotate(${item.rotate}) scale(${item.scale}) translate(-50 -100)`
</script>

<template>
  <g id="addons">
    <g v-for="item in items" :key="item.kind" :transform="transformFor(item)">
      <AddonPlates v-if="item.kind === 'addon-plates'" />
      <AddonKnife v-else-if="item.kind === 'addon-knife'" />
      <AddonCard v-else-if="item.kind === 'addon-card'" />
      <AddonBox v-else-if="item.kind === 'addon-box'" />
    </g>
  </g>
</template>
