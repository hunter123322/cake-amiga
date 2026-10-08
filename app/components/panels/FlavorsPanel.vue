<script setup lang="ts">
import { FLAVORS } from '~/data/flavors'

const store = useCakeStore()
const { playTap } = useSound()

function setFlavor(tierId: string, flavorId: string) {
  store.setFlavor(tierId, flavorId)
  store.selectTier(tierId)
  playTap()
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-slate-500">
      Swipe a flavor for every tier — tap a tier in the preview to see which one you're editing.
    </p>
    <section
      v-for="(tier, i) in [...store.tiers].reverse()"
      :key="tier.id"
      class="rounded-2xl bg-white p-3 shadow-sm"
      :class="store.selectedTierId === tier.id ? 'ring-2 ring-amber-300' : ''"
    >
      <h3 class="mb-1 flex items-center justify-between text-sm font-semibold">
        Tier {{ store.tiers.length - i }}
        <span class="text-xs font-normal text-slate-400">{{ tier.diameterIn }}" wide</span>
      </h3>
      <SwipeCarousel
        :items="FLAVORS"
        :model-value="tier.flavorId"
        :label="`Flavor for tier ${store.tiers.length - i}`"
        @update:model-value="setFlavor(tier.id, $event)"
      >
        <template #default="{ item, selected }">
          <div class="flex flex-col items-center gap-1.5">
            <svg viewBox="0 0 60 58" class="h-11 w-11" aria-hidden="true">
              <rect x="12" y="18" width="36" height="9" rx="3" :fill="item.sponge" />
              <rect x="12" y="27" width="36" height="5" :fill="item.cream" />
              <rect x="12" y="32" width="36" height="9" :fill="item.sponge" />
              <rect x="12" y="41" width="36" height="5" :fill="item.cream" />
              <ellipse cx="30" cy="18" rx="18" ry="4" :fill="item.accent" opacity="0.4" />
            </svg>
            <span class="text-xs font-medium leading-tight">{{ item.name }}</span>
            <UiIcon v-if="selected" name="check" class="h-3.5 w-3.5 text-amber-500" />
          </div>
        </template>
      </SwipeCarousel>
    </section>
  </div>
</template>
