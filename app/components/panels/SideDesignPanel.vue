<script setup lang="ts">
import { SIDE_COLORS, SIDE_DESIGNS, getSideDesign } from '~/data/sideDesigns'
import type { SideDesignId } from '~/types/cake'

const store = useCakeStore()
const { playTap } = useSound()

const selected = computed(() => getSideDesign(store.sideDesign.id))
const messageLength = computed(() => store.sideDesign.message.length)

function setDesign(id: string) {
  store.setSideDesign(id as SideDesignId)
  playTap()
}

const asSideId = (id: string) => id as SideDesignId
</script>

<template>
  <div class="space-y-5">
    <section class="rounded-2xl bg-white p-4 shadow-sm">
      <h2 class="text-sm font-semibold">Side design</h2>
      <p class="mt-0.5 text-xs text-slate-400">{{ selected.blurb }}</p>
      <div class="mt-2">
        <SwipeCarousel
          :items="SIDE_DESIGNS"
          :model-value="store.sideDesign.id"
          label="Side designs"
          @update:model-value="setDesign($event)"
        >
          <template #default="{ item }">
            <div class="flex flex-col items-center gap-1">
              <svg viewBox="-45 -4 90 86" class="h-12 w-full" aria-hidden="true">
                <defs>
                  <clipPath :id="`side-preview-${item.id}`">
                    <rect x="-40" y="6" width="80" height="66" rx="5" />
                  </clipPath>
                </defs>
                <rect
                  x="-40"
                  y="6"
                  width="80"
                  height="66"
                  rx="5"
                  :fill="store.coating.color"
                  stroke="#e2e8f0"
                  stroke-width="1"
                />
                <g :clip-path="`url(#side-preview-${item.id})`">
                  <SideDesignLayer
                    :id="asSideId(item.id)"
                    :color="store.sideDesign.color"
                    message="Happy Birthday"
                    :rx="40"
                    :ry="8"
                    :top-y="14"
                    :bottom-y="64"
                    seed="preview"
                  />
                </g>
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

    <section class="rounded-2xl bg-white p-4 shadow-sm">
      <ColorPicker
        :model-value="store.sideDesign.color"
        :colors="SIDE_COLORS"
        label="Design colour"
        @update:model-value="store.setSideColor($event); playTap()"
      />
    </section>

    <section v-if="store.sideDesign.id === 'side-message'" class="rounded-2xl bg-white p-4 shadow-sm">
      <label for="cake-message" class="text-sm font-medium text-slate-700">Your message</label>
      <input
        id="cake-message"
        type="text"
        class="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        placeholder="Happy Birthday"
        :value="store.sideDesign.message"
        :maxlength="30"
        @input="store.setMessage(($event.target as HTMLInputElement).value)"
      >
      <div class="mt-1 flex justify-between text-[11px] text-slate-400">
        <span>Piped on the front of every tier.</span>
        <span>{{ messageLength }}/30</span>
      </div>
    </section>
  </div>
</template>
