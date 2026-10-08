<script setup lang="ts">
import { TOP_COLORS, TOP_DESIGNS, getTopDesign } from '~/data/topDesigns'
import type { TopDesignId } from '~/types/cake'
import type { TierGeometry } from '~/composables/useCakeGeometry'

const store = useCakeStore()
const { playTap } = useSound()

const definition = computed(() => getTopDesign(store.topDesign.id))

function setTop(id: string) {
  store.setTopDesign(id as TopDesignId)
  playTap()
}

const asTopId = (id: string) => id as TopDesignId

/** Neutral geometry for the previews. TopDesignLayer anchors the asset's (50, 100)
 *  — the top-ellipse centre — at the group origin, so the frame below is centred on (0, 0). */
const previewGeom: TierGeometry = {
  id: 'preview',
  index: 0,
  isTop: true,
  rx: 50,
  ry: 10,
  bodyH: 0,
  bottomY: 0,
  topY: 0,
  bodyPath: '',
  clipId: 'preview-body',
  wedgeClipId: 'preview-wedge',
}
</script>

<template>
  <div class="space-y-5">
    <section class="rounded-2xl bg-white p-4 shadow-sm">
      <h2 class="text-sm font-semibold">Top design</h2>
      <p class="mt-0.5 text-xs text-slate-400">{{ definition.blurb }}</p>
      <div class="mt-2">
        <SwipeCarousel
          :items="TOP_DESIGNS"
          :model-value="store.topDesign.id"
          label="Top designs"
          @update:model-value="setTop($event)"
        >
          <template #default="{ item }">
            <div class="flex flex-col items-center gap-1">
              <svg viewBox="-58 -88 116 122" class="h-auto w-full" aria-hidden="true">
                <ellipse cx="0" cy="0" rx="50" ry="10" :fill="store.coating.color" opacity="0.55" />
                <TopDesignLayer
                  :geom="previewGeom"
                  :design="{ ...store.topDesign, id: asTopId(item.id) }"
                  seed="preview"
                />
              </svg>
              <span class="text-xs font-medium leading-tight">{{ item.name }}</span>
              <span class="text-[10px] text-slate-400">
                {{ item.price ? `+${formatCurrency(item.price)}` : 'included' }}
              </span>
            </div>
          </template>
        </SwipeCarousel>
      </div>
    </section>

    <section v-if="definition.candleCount" class="rounded-2xl bg-white p-4 shadow-sm">
      <RangeSlider
        :model-value="store.topDesign.candleCount"
        :min="1"
        :max="7"
        :step="1"
        label="Candles"
        @update:model-value="store.setCandleCount($event)"
      />
    </section>

    <section v-if="definition.number" class="rounded-2xl bg-white p-4 shadow-sm">
      <label for="topper-number" class="text-sm font-medium text-slate-700">Number on topper</label>
      <input
        id="topper-number"
        type="text"
        inputmode="numeric"
        class="mt-2 h-11 w-24 rounded-xl border border-slate-200 px-3 text-center text-lg font-semibold focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        :value="store.topDesign.number"
        maxlength="2"
        @input="store.setTopNumber(($event.target as HTMLInputElement).value)"
      >
      <p class="mt-1 text-[11px] text-slate-400">Up to two digits — 1 to 99.</p>
    </section>

    <section class="rounded-2xl bg-white p-4 shadow-sm">
      <ColorPicker
        :model-value="store.topDesign.color"
        :colors="TOP_COLORS"
        label="Topper colour"
        @update:model-value="store.setTopColor($event); playTap()"
      />
    </section>
  </div>
</template>
