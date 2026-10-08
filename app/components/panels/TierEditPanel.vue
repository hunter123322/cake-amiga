<script setup lang="ts">
import type { Tier } from '~/types/cake'
import { getFlavor } from '~/data/flavors'

const props = defineProps<{ tier: Tier }>()
const store = useCakeStore()

const flavor = computed(() => getFlavor(props.tier.flavorId))
</script>

<template>
  <div class="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold">Editing the highlighted tier</h3>
      <span
        class="rounded-full px-2.5 py-0.5 text-xs font-medium text-slate-600"
        :style="{ background: flavor.cream }"
      >
        {{ flavor.name }}
      </span>
    </div>
    <RangeSlider
      :model-value="props.tier.diameterIn"
      :min="8"
      :max="12"
      :step="0.5"
      unit=" in"
      label="Diameter"
      @update:model-value="store.updateTier(props.tier.id, { diameterIn: $event })"
    />
    <RangeSlider
      :model-value="props.tier.heightIn"
      :min="4"
      :max="10"
      :step="0.5"
      unit=" in"
      label="Height"
      @update:model-value="store.updateTier(props.tier.id, { heightIn: $event })"
    />
    <p class="text-[11px] leading-relaxed text-slate-400">
      8–12 in wide and 4–10 in tall. If you narrow a tier, the tiers above it shrink automatically so
      nothing overhangs.
    </p>
  </div>
</template>
