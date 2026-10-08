<script setup lang="ts">
import type { TopDesign } from '~/types/cake'
import type { TierGeometry } from '~/composables/useCakeGeometry'

const props = defineProps<{
  geom: TierGeometry
  design: TopDesign
  seed: string
}>()

const transform = computed(() => {
  const scale = props.geom.rx / 50
  return `translate(0 ${props.geom.topY}) scale(${scale.toFixed(4)}) translate(-50 -100)`
})
</script>

<template>
  <g :transform="transform">
    <TopFlowers
      v-if="props.design.id === 'top-flowers'"
      :color="props.design.color"
      :seed="props.seed"
    />
    <TopCandles
      v-else-if="props.design.id === 'top-candles'"
      :color="props.design.color"
      :count="props.design.candleCount"
      :seed="props.seed"
    />
    <TopTopperHappy
      v-else-if="props.design.id === 'top-topper-happy'"
      :color="props.design.color"
      :seed="props.seed"
    />
    <TopTopperNumber
      v-else-if="props.design.id === 'top-topper-number'"
      :color="props.design.color"
      :number="props.design.number"
      :seed="props.seed"
    />
    <TopFruit
      v-else-if="props.design.id === 'top-fruit'"
      :color="props.design.color"
      :seed="props.seed"
    />
    <TopFigurine
      v-else-if="props.design.id === 'top-figurine'"
      :color="props.design.color"
      :seed="props.seed"
    />
    <TopDrip
      v-else-if="props.design.id === 'top-drip'"
      :color="props.design.color"
      :seed="props.seed"
    />
  </g>
</template>
