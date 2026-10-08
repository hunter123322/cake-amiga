<script setup lang="ts">
import { getFlavor } from '~/data/flavors'
import { getCoatingFinish } from '~/data/coatings'
import { getSideDesign } from '~/data/sideDesigns'
import { getTopDesign } from '~/data/topDesigns'
import type { Tier } from '~/types/cake'
import type { TierGeometry } from '~/composables/useCakeGeometry'

const store = useCakeStore()

const layout = computed(() =>
  buildSceneLayout(store.tiers, {
    topElevation: store.topDesignDef.elevation,
    hasSideAddOns: store.addOns.some((id) => id !== 'addon-candles'),
    hasBox: store.addOns.includes('addon-box'),
  }),
)

/** Tier geometry paired with its config — the two always exist together. */
const sceneTiers = computed(() =>
  layout.value.tiers
    .map((geom) => ({ geom, tier: store.tiers[geom.index] }))
    .filter((entry): entry is { geom: TierGeometry; tier: Tier } => Boolean(entry.tier)),
)

const topTierGeom = computed(() => layout.value.tiers[layout.value.tiers.length - 1])

const ariaLabel = computed(() => {
  const tiers = store.tiers
    .map(
      (tier, i) =>
        `tier ${i + 1}: ${tier.diameterIn} inch wide, ${tier.heightIn} inch tall, ${getFlavor(tier.flavorId).name}`,
    )
    .join('; ')
  return `Custom ${store.tiers.length}-tier cake. ${tiers}. Coating: ${getCoatingFinish(store.coating.finish).name}. Side: ${getSideDesign(store.sideDesign.id).name}. Top: ${getTopDesign(store.topDesign.id).name}.`
})

function onTierSelect(id: string) {
  store.selectTier(id)
  // Tapping a tier jumps to the flavor step so you can swipe its flavour.
  if (store.currentStep.id !== 'size' && store.currentStep.id !== 'flavor') {
    store.setStep(1)
  }
}
</script>

<template>
  <ClientOnly>
    <svg
      :viewBox="layout.viewBox"
      preserveAspectRatio="xMidYMax meet"
      class="h-full w-full"
      role="img"
      :aria-label="ariaLabel"
    >
      <SvgDefs />
      <PlateLayer :plate="layout.plate" />
      <TierLayer
        v-for="entry in sceneTiers"
        :key="entry.geom.id"
        :geom="entry.geom"
        :tier="entry.tier"
        :coating="store.coating"
        :side-design="store.sideDesign"
        :selected="entry.geom.id === store.selectedTierId"
        :slice="store.view === 'slice'"
        @select="onTierSelect(entry.geom.id)"
      />
      <TopDesignLayer
        v-if="topTierGeom"
        :geom="topTierGeom"
        :design="store.topDesign"
        :seed="topTierGeom.id"
      />
      <AddOnLayer :plate="layout.plate" :add-ons="store.addOns" />
    </svg>
    <template #fallback>
      <div class="flex h-full w-full items-center justify-center text-sm text-slate-400">
        Warming the oven…
      </div>
    </template>
  </ClientOnly>
</template>
