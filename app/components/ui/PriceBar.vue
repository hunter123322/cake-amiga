<script setup lang="ts">
import { STEPS } from '~/stores/cake'

const store = useCakeStore()
const { pushToast } = useToasts()
const { fire } = useConfetti()
const { playTap } = useSound()

const isReview = computed(() => store.currentStep.id === 'review')
const isLast = computed(() => store.currentStepIndex >= STEPS.length - 1)

function next() {
  store.nextStep()
  playTap()
}

function back() {
  store.prevStep()
  playTap()
}

function addToCart() {
  if (!store.validation.isValid) {
    pushToast(store.validation.errors[0] ?? 'Please fix the highlighted issues first.', 'warn')
    return
  }
  const payload = store.addToCart()
  fire()
  playTap(880)
  pushToast(
    `Added to cart — ${formatCurrency(payload.pricing.total)} · ${payload.pricing.servings} servings`,
  )
}
</script>

<template>
  <div class="sticky bottom-0 z-20 border-t border-slate-100 bg-white/95 px-4 py-3 backdrop-blur">
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <div class="text-[11px] uppercase tracking-wide text-slate-400">
          {{ isReview ? 'Order total' : `${store.currentStep.label} · live price` }}
        </div>
        <div class="text-xl font-bold tabular-nums text-slate-900" aria-live="polite">
          {{ formatCurrency(store.totalPrice) }}
        </div>
        <div class="truncate text-[11px] text-slate-500">
          {{ store.weightKg.toFixed(1) }} kg · {{ store.servings }} servings · ≈{{ store.leadTimeDays }} days
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <button
          v-if="store.currentStepIndex > 0"
          type="button"
          class="min-h-11 min-w-11 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          @click="back"
        >
          Back
        </button>
        <button
          v-if="!isLast"
          type="button"
          class="flex min-h-11 items-center gap-1.5 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-[0.97]"
          @click="next"
        >
          Next
          <UiIcon name="chevron-right" class="h-4 w-4" />
        </button>
        <button
          v-else
          type="button"
          class="flex min-h-11 items-center gap-2 rounded-full bg-rose-500 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-rose-600 active:scale-[0.97]"
          @click="addToCart"
        >
          <UiIcon name="cart" class="h-4 w-4" />
          Add to cart
        </button>
      </div>
    </div>
  </div>
</template>
