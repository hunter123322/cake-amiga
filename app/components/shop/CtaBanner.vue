<script setup lang="ts">
import { SHOP_INFO } from '~/data/shop/info'

withDefaults(defineProps<{ category?: string; orderNote?: string }>(), {
  category: '',
  orderNote: '',
})
</script>

<template>
  <section class="overflow-hidden rounded-[28px] bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 p-6 ring-1 ring-white/60 lg:p-8">
    <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div class="max-w-xl">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-amber-700/80">Made in Bacacay, Albay</p>
        <h2 class="mt-1.5 text-xl font-extrabold tracking-[-0.02em] text-slate-900 lg:text-2xl">
          <template v-if="category === 'cakes'">Can’t find the cake you picture?</template>
          <template v-else>Craving something that isn’t on the list?</template>
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-slate-600">
          <template v-if="category === 'cakes'">
            Design your own tiers, flavours, coatings and toppers in the cake builder and send us the link — we will
            confirm the sketch and the schedule.
          </template>
          <template v-else>
            {{ orderNote || 'Message us and we will tell you what is on the tray today.' }}
          </template>
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-if="category === 'cakes'"
          to="/cake-builder"
          class="inline-flex h-12 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition active:scale-[0.97] hover:bg-slate-800"
        >
          <UiIcon name="sparkle" class="h-4 w-4" />
          Open the cake builder
        </NuxtLink>
        <a
          :href="SHOP_INFO.messenger"
          target="_blank"
          rel="noopener"
          class="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-800 ring-1 ring-white/70 transition active:scale-[0.97] hover:ring-slate-200"
        >
          <UiIcon name="chat" class="h-4 w-4" />
          Message us
        </a>
        <a
          :href="SHOP_INFO.mapLink"
          target="_blank"
          rel="noopener"
          class="inline-flex h-12 items-center gap-2 rounded-full bg-white/70 px-5 text-sm font-semibold text-slate-800 ring-1 ring-white/70 transition active:scale-[0.97] hover:ring-slate-200"
        >
          <UiIcon name="map-pin" class="h-4 w-4" />
          Visit the shop
        </a>
      </div>
    </div>
  </section>
</template>
