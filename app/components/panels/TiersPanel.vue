<script setup lang="ts">
import { PRESETS } from '~/data/presets'
import { getFlavor } from '~/data/flavors'

const store = useCakeStore()
const { playTap } = useSound()

const orderedTiers = computed(() => [...store.tiers].reverse())
</script>

<template>
  <div class="space-y-5">
    <section>
      <h2 class="text-sm font-semibold text-slate-700">Start from a template</h2>
      <div class="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-2">
        <button
          v-for="preset in PRESETS"
          :key="preset.id"
          type="button"
          class="min-h-11 shrink-0 rounded-full border border-slate-200 bg-white px-3.5 text-sm transition hover:border-amber-300 hover:bg-amber-50"
          @click="store.applyPreset(preset.id); playTap()"
        >
          <span class="mr-1" aria-hidden="true">{{ preset.emoji }}</span>{{ preset.name }}
        </button>
      </div>
    </section>

    <section class="rounded-2xl bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">Tiers</h2>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
            :disabled="!store.canRemoveTier"
            aria-label="Remove the top tier"
            @click="store.removeTier(); playTap()"
          >
            <UiIcon name="minus" class="h-4 w-4" />
          </button>
          <span class="w-16 text-center text-sm font-semibold tabular-nums">
            {{ store.tierCount }} {{ store.tierCount === 1 ? 'tier' : 'tiers' }}
          </span>
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
            :disabled="!store.canAddTier"
            aria-label="Add a tier on top"
            @click="store.addTier(); playTap()"
          >
            <UiIcon name="plus" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <div class="mt-3 space-y-2">
        <button
          v-for="(tier, i) in orderedTiers"
          :key="tier.id"
          type="button"
          class="flex w-full items-center justify-between gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition"
          :class="
            store.selectedTierId === tier.id
              ? 'border-amber-400 bg-amber-50'
              : 'border-slate-100 bg-white hover:border-slate-200'
          "
          @click="store.selectTier(tier.id); playTap()"
        >
          <span class="min-w-0">
            <span class="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Tier {{ store.tiers.length - i }}{{ i === 0 ? ' · top' : '' }}
            </span>
            <span class="block truncate text-sm font-medium text-slate-700">
              {{ tier.diameterIn }}" × {{ tier.heightIn }}" · {{ getFlavor(tier.flavorId).name }}
            </span>
          </span>
          <span
            class="h-6 w-6 shrink-0 rounded-full border-2"
            :style="{
              background: getFlavor(tier.flavorId).sponge,
              borderColor: store.selectedTierId === tier.id ? '#f59e0b' : '#e2e8f0',
            }"
            aria-hidden="true"
          />
        </button>
      </div>

      <div class="mt-3">
        <div class="flex justify-between text-[11px] text-slate-400">
          <span>Stability</span>
          <span>{{ store.validation.stability }}/100</span>
        </div>
        <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            class="h-full rounded-full transition-all duration-300"
            :class="
              store.validation.stability > 70
                ? 'bg-emerald-400'
                : store.validation.stability > 45
                  ? 'bg-amber-400'
                  : 'bg-rose-400'
            "
            :style="{ width: `${store.validation.stability}%` }"
          />
        </div>
      </div>
    </section>

    <TierEditPanel v-if="store.selectedTier" :tier="store.selectedTier" />

    <ul
      v-if="store.validation.warnings.length"
      class="space-y-1 rounded-2xl bg-amber-50 p-3 text-xs text-amber-700"
      role="status"
    >
      <li v-for="warning in store.validation.warnings" :key="warning">{{ warning }}</li>
    </ul>
  </div>
</template>
