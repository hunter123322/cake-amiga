<script setup lang="ts">
import type { CoatingFinishId } from '~/types/cake'

const props = defineProps<{
  finish: CoatingFinishId
  color: string
  rx: number
  ry: number
  topY: number
  bottomY: number
  seed: string
}>()
</script>

<template>
  <CoatingSmooth
    v-if="props.finish === 'coating-smooth'"
    :rx="props.rx"
    :ry="props.ry"
    :top-y="props.topY"
    :bottom-y="props.bottomY"
    :color="props.color"
    :seed="props.seed"
  />
  <CoatingTextured
    v-else-if="props.finish === 'coating-textured'"
    :rx="props.rx"
    :ry="props.ry"
    :top-y="props.topY"
    :bottom-y="props.bottomY"
    :color="props.color"
    :seed="props.seed"
  />
  <CoatingDrip
    v-else-if="props.finish === 'coating-drip'"
    :rx="props.rx"
    :ry="props.ry"
    :top-y="props.topY"
    :bottom-y="props.bottomY"
    :color="props.color"
    :seed="props.seed"
  />
  <CoatingRustic
    v-else-if="props.finish === 'coating-rustic'"
    :rx="props.rx"
    :ry="props.ry"
    :top-y="props.topY"
    :bottom-y="props.bottomY"
    :color="props.color"
    :seed="props.seed"
  />
</template>
