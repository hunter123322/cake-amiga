<script setup lang="ts">
import { COATING_COLORS, COATING_FINISHES, getCoatingFinish } from '~/data/coatings'
import type { CoatingFinishId } from '~/types/cake'

const store = useCakeStore()
const { playTap } = useSound()

const finish = computed(() => getCoatingFinish(store.coating.finish))

function setFinish(id: string) {
  store.setCoatingFinish(id as CoatingFinishId)
  playTap()
}
</script>

<template>
  <div class="space-y-5">
    <section class="rounded-2xl bg-white p-4 shadow-sm">
      <h3 class="text-sm font-semibold">Finish</h3>
      <p class="mt-0.5 text-xs text-slate-400">{{ finish.blurb }}</p>
      <div class="mt-2">
        <SwipeCarousel
          :items="COATING_FINISHES"
          :model-value="store.coating.finish"
          label="Coating finish"
          @update:model-value="setFinish($event)"
        >
          <template #default="{ item }">
            <div class="flex flex-col items-center gap-1">
              <svg viewBox="-36 -2 72 76" class="h-12 w-full" aria-hidden="true">
                <rect
                  x="-32"
                  y="6"
                  width="64"
                  height="62"
                  rx="5"
                  :fill="store.coating.color"
                  stroke="#e2e8f0"
                  stroke-width="1"
                />
                <template v-if="item.id === 'coating-textured'">
                  <path
                    d="M-26 24q8-6 16 0t16 0"
                    fill="none"
                    :stroke="darken(store.coating.color, 14)"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    opacity="0.3"
                  />
                  <path
                    d="M-26 40q8-6 16 0t16 0"
                    fill="none"
                    :stroke="darken(store.coating.color, 14)"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    opacity="0.3"
                  />
                  <path
                    d="M-26 56q8-6 16 0t16 0"
                    fill="none"
                    :stroke="darken(store.coating.color, 14)"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    opacity="0.3"
                  />
                </template>
                <template v-else-if="item.id === 'coating-drip'">
                  <path
                    d="M-30 8 q8 14 16 0 q8 14 16 0 q8 14 16 0 q8 14 14 0 Z"
                    :fill="lighten(store.coating.color, 8)"
                    :stroke="darken(store.coating.color, 12)"
                    stroke-width="1"
                  />
                </template>
                <template v-else-if="item.id === 'coating-rustic'">
                  <path
                    d="M-28 20q13-7 26 0t24-3"
                    fill="none"
                    :stroke="lighten(store.coating.color, 8)"
                    stroke-width="5"
                    stroke-linecap="round"
                    opacity="0.55"
                  />
                  <path
                    d="M-26 38q13-7 26 0t22-3"
                    fill="none"
                    :stroke="lighten(store.coating.color, 8)"
                    stroke-width="5"
                    stroke-linecap="round"
                    opacity="0.55"
                  />
                  <path
                    d="M-28 56q13-7 26 0t24-3"
                    fill="none"
                    :stroke="lighten(store.coating.color, 8)"
                    stroke-width="5"
                    stroke-linecap="round"
                    opacity="0.55"
                  />
                </template>
                <template v-else>
                  <ellipse cx="-14" cy="14" rx="12" ry="3" fill="#ffffff" opacity="0.4" />
                </template>
              </svg>
              <span class="text-xs font-medium">{{ item.name }}</span>
              <span class="text-[10px] text-slate-400">
                {{ item.price ? `+${formatCurrency(item.price)}` : 'included' }}
              </span>
            </div>
          </template>
        </SwipeCarousel>
      </div>
    </section>

    <section class="rounded-2xl bg-white p-4 shadow-sm">
      <ColorPicker
        :model-value="store.coating.color"
        :colors="COATING_COLORS"
        label="Coating colour"
        @update:model-value="store.setCoatingColor($event); playTap()"
      />
    </section>

    <p class="text-xs text-slate-400">
      Tip: flip the preview to
      <button type="button" class="font-medium text-amber-600 underline" @click="store.setView('slice')">
        slice view
      </button>
      to peek at the sponge inside.
    </p>
  </div>
</template>
