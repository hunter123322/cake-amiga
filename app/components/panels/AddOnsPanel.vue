<script setup lang="ts">
import { ADD_ONS } from '~/data/addOns'

const store = useCakeStore()
const { playTap } = useSound()

const extrasTotal = computed(() =>
  store.addOns.reduce((sum, id) => sum + (ADD_ONS.find((a) => a.id === id)?.price ?? 0), 0),
)

function toggle(id: (typeof ADD_ONS)[number]['id']) {
  store.toggleAddOn(id)
  playTap()
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-slate-500">Little extras that make the party easier — tap to add.</p>

    <div class="space-y-2">
      <button
        v-for="item in ADD_ONS"
        :key="item.id"
        type="button"
        :aria-pressed="store.addOns.includes(item.id)"
        class="flex w-full items-center gap-3 rounded-2xl border-2 bg-white p-3 text-left transition"
        :class="
          store.addOns.includes(item.id)
            ? 'border-amber-400 bg-amber-50'
            : 'border-transparent shadow-sm hover:border-slate-200'
        "
        @click="toggle(item.id)"
      >
        <svg viewBox="0 0 100 100" class="h-12 w-12 shrink-0" aria-hidden="true">
          <AddonCandles v-if="item.id === 'addon-candles'" />
          <AddonKnife v-else-if="item.id === 'addon-knife'" />
          <AddonPlates v-else-if="item.id === 'addon-plates'" />
          <AddonCard v-else-if="item.id === 'addon-card'" />
          <AddonBox v-else-if="item.id === 'addon-box'" />
        </svg>
        <span class="min-w-0 flex-1">
          <span class="block text-sm font-semibold">{{ item.name }}</span>
          <span class="block text-xs text-slate-400">{{ item.blurb }}</span>
        </span>
        <span class="text-sm font-semibold tabular-nums">{{ formatCurrency(item.price) }}</span>
        <span
          class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition"
          :class="
            store.addOns.includes(item.id)
              ? 'border-amber-400 bg-amber-400 text-white'
              : 'border-slate-200 text-transparent'
          "
          aria-hidden="true"
        >
          <UiIcon name="check" class="h-3.5 w-3.5" />
        </span>
      </button>
    </div>

    <p class="text-right text-sm text-slate-500">
      Extras total
      <span class="font-semibold text-slate-800">{{ formatCurrency(extrasTotal) }}</span>
    </p>
  </div>
</template>
