<script setup lang="ts">
import { STEPS } from '~/stores/cake'

const store = useCakeStore()
const { playTap } = useSound()

function go(index: number) {
  store.setStep(index)
  playTap()
}
</script>

<template>
  <nav class="hidden items-start justify-between gap-1 px-3 py-3 lg:flex" aria-label="Builder steps">
    <template v-for="(step, i) in STEPS" :key="step.id">
      <button
        type="button"
        class="group flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-0.5 py-1.5 transition"
        :class="i === store.currentStepIndex ? '' : 'hover:bg-slate-100'"
        :aria-current="i === store.currentStepIndex ? 'step' : undefined"
        @click="go(i)"
      >
        <span
          class="flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200"
          :class="
            i === store.currentStepIndex
              ? 'border-slate-900 bg-slate-900 text-white shadow-md'
              : i < store.currentStepIndex
                ? 'border-amber-200 bg-amber-100 text-amber-600'
                : 'border-slate-200 bg-white text-slate-400'
          "
        >
          <UiIcon :name="i < store.currentStepIndex ? 'check' : step.icon" class="h-4 w-4" />
        </span>
        <span
          class="w-full truncate text-center text-[10px] font-medium tracking-tight"
          :class="
            i === store.currentStepIndex
              ? 'text-slate-900'
              : i < store.currentStepIndex
                ? 'text-amber-600'
                : 'text-slate-400'
          "
        >{{ step.label }}</span>
      </button>
      <span
        v-if="i < STEPS.length - 1"
        class="mt-4 h-0.5 w-2 shrink-0 rounded-full bg-slate-200"
        aria-hidden="true"
      />
    </template>
  </nav>
</template>
