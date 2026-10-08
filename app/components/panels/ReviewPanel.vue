<script setup lang="ts">
import { getFlavor } from '~/data/flavors'
import { getCoatingColorName, getCoatingFinish } from '~/data/coatings'
import { getSideColorName, getSideDesign } from '~/data/sideDesigns'
import { getTopDesign } from '~/data/topDesigns'
import { ADD_ONS } from '~/data/addOns'

const store = useCakeStore()
const { pushToast } = useToasts()
const { fire } = useConfetti()
const { playTap } = useSound()
const { copyShareLink } = useShareLink()

const deliveryDate = ref('')

const minDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + store.leadTimeDays)
  return date.toISOString().slice(0, 10)
})

const addOnNames = computed(() =>
  store.addOns
    .map((id) => ADD_ONS.find((a) => a.id === id)?.name)
    .filter(Boolean)
    .join(', '),
)

const lastCartItem = computed(() => store.cart[store.cart.length - 1])

function addToCart() {
  if (!store.validation.isValid) {
    pushToast(store.validation.errors[0] ?? 'Please fix the highlighted issues first.', 'warn')
    return
  }
  const payload = store.addToCart()
  fire()
  playTap(880)
  pushToast(
    `Added to cart — ${formatCurrency(payload.pricing.total)} · ready in ≈${payload.pricing.leadTimeDays} days`,
  )
}
</script>

<template>
  <div class="space-y-5">
    <section
      v-if="store.validation.errors.length || store.validation.warnings.length"
      class="space-y-1 rounded-2xl bg-amber-50 p-3 text-xs text-amber-700"
      role="status"
    >
      <p v-for="error in store.validation.errors" :key="error" class="font-medium">{{ error }}</p>
      <p v-for="warning in store.validation.warnings" :key="warning">{{ warning }}</p>
    </section>

    <section class="rounded-2xl bg-white p-4 shadow-sm">
      <h3 class="text-sm font-semibold">Your cake</h3>
      <dl class="mt-2 space-y-2 text-sm">
        <div class="flex justify-between gap-4">
          <dt class="shrink-0 text-slate-400">Tiers</dt>
          <dd class="text-right font-medium">
            <span v-for="(tier, i) in store.tiers" :key="tier.id" class="block">
              {{ i + 1 }}. {{ tier.diameterIn }}" × {{ tier.heightIn }}" ·
              {{ getFlavor(tier.flavorId).name }}
            </span>
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-slate-400">Coating</dt>
          <dd class="font-medium">
            {{ getCoatingFinish(store.coating.finish).name }} · {{ getCoatingColorName(store.coating.color) }}
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-slate-400">Side</dt>
          <dd class="text-right font-medium">
            {{ getSideDesign(store.sideDesign.id).name }} · {{ getSideColorName(store.sideDesign.color) }}
            <span v-if="store.sideDesign.message" class="block text-slate-500">“{{ store.sideDesign.message }}”</span>
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-slate-400">Top</dt>
          <dd class="text-right font-medium">
            {{ getTopDesign(store.topDesign.id).name }}
            <span v-if="store.topDesign.id === 'top-candles'" class="block text-slate-500">
              {{ store.topDesign.candleCount }} candles
            </span>
            <span v-else-if="store.topDesign.id === 'top-topper-number'" class="block text-slate-500">
              Number {{ store.topDesign.number }}
            </span>
          </dd>
        </div>
        <div v-if="addOnNames" class="flex justify-between gap-4">
          <dt class="text-slate-400">Extras</dt>
          <dd class="text-right font-medium">{{ addOnNames }}</dd>
        </div>
      </dl>
    </section>

    <section class="rounded-2xl bg-white p-4 shadow-sm">
      <h3 class="text-sm font-semibold">Delivery</h3>
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <input
          v-model="deliveryDate"
          type="date"
          :min="minDate"
          class="h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
          aria-label="Delivery date"
        >
        <label class="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-slate-50 px-3 text-sm">
          <input
            type="checkbox"
            class="h-4 w-4 accent-rose-500"
            :checked="store.rush"
            @change="store.setRush(($event.target as HTMLInputElement).checked)"
          >
          Rush it (+$15)
        </label>
      </div>
      <div class="mt-3 flex flex-wrap gap-2 text-xs">
        <span class="rounded-full bg-slate-100 px-2.5 py-1">≈{{ store.leadTimeDays }} days lead time</span>
        <span class="rounded-full bg-slate-100 px-2.5 py-1">{{ store.weightKg.toFixed(1) }} kg</span>
        <span class="rounded-full bg-slate-100 px-2.5 py-1">≈{{ store.servings }} servings</span>
        <span class="rounded-full bg-slate-100 px-2.5 py-1">{{ store.totalHeightIn }}" tall</span>
      </div>
    </section>

    <section class="rounded-2xl bg-white p-4 shadow-sm">
      <h3 class="text-sm font-semibold">Price breakdown</h3>
      <ul class="mt-2">
        <li
          v-for="line in store.pricing.lines"
          :key="line.id"
          class="flex justify-between py-1 text-sm text-slate-600"
        >
          <span>{{ line.label }}</span>
          <span class="tabular-nums">{{ formatCurrency(line.amount) }}</span>
        </li>
      </ul>
      <div class="mt-2 flex justify-between border-t border-slate-100 pt-2 text-base font-bold">
        <span>Total</span>
        <span class="tabular-nums">{{ formatCurrency(store.totalPrice) }}</span>
      </div>
    </section>

    <div class="flex gap-2">
      <button
        type="button"
        class="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-500 text-sm font-semibold text-white shadow-md transition hover:bg-rose-600 active:scale-[0.98]"
        @click="addToCart"
      >
        <UiIcon name="cart" class="h-4 w-4" />
        Add to cart
      </button>
      <button
        type="button"
        class="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        @click="copyShareLink"
      >
        <UiIcon name="share" class="h-4 w-4" />
        Share
      </button>
    </div>

    <p v-if="store.cart.length && lastCartItem" class="text-center text-xs text-slate-400">
      {{ store.cart.length }} cake{{ store.cart.length === 1 ? '' : 's' }} in your cart — last added
      {{ formatCurrency(lastCartItem.pricing.total) }}.
    </p>
  </div>
</template>
