<script setup lang="ts">
import type { SideDesignId } from '~/types/cake'

const props = defineProps<{
  id: SideDesignId
  color: string
  message: string
  rx: number
  ry: number
  topY: number
  bottomY: number
  seed: string
}>()
</script>

<template>
  <SidePipingDots
    v-if="props.id === 'side-piping-dots'"
    :rx="props.rx"
    :ry="props.ry"
    :top-y="props.topY"
    :bottom-y="props.bottomY"
    :color="props.color"
    :seed="props.seed"
  />
  <SidePipingScallop
    v-else-if="props.id === 'side-piping-scallop'"
    :rx="props.rx"
    :ry="props.ry"
    :top-y="props.topY"
    :bottom-y="props.bottomY"
    :color="props.color"
    :seed="props.seed"
  />
  <SideStripes
    v-else-if="props.id === 'side-stripes'"
    :rx="props.rx"
    :ry="props.ry"
    :top-y="props.topY"
    :bottom-y="props.bottomY"
    :color="props.color"
    :seed="props.seed"
  />
  <SidePearls
    v-else-if="props.id === 'side-pearls'"
    :rx="props.rx"
    :ry="props.ry"
    :top-y="props.topY"
    :bottom-y="props.bottomY"
    :color="props.color"
    :seed="props.seed"
  />
  <SideRibbon
    v-else-if="props.id === 'side-ribbon'"
    :rx="props.rx"
    :ry="props.ry"
    :top-y="props.topY"
    :bottom-y="props.bottomY"
    :color="props.color"
    :seed="props.seed"
  />
  <SideMessage
    v-else-if="props.id === 'side-message'"
    :rx="props.rx"
    :ry="props.ry"
    :top-y="props.topY"
    :bottom-y="props.bottomY"
    :color="props.color"
    :message="props.message"
    :seed="props.seed"
  />
  <SideSprinkles
    v-else-if="props.id === 'side-sprinkles'"
    :rx="props.rx"
    :ry="props.ry"
    :top-y="props.topY"
    :bottom-y="props.bottomY"
    :color="props.color"
    :seed="props.seed"
  />
</template>
