<script setup lang="ts">
import { STEPS } from '~/stores/cake'

const store = useCakeStore()
const { playTap } = useSound()

const percent = computed(
  () => ((store.currentStepIndex + 1) / STEPS.length) * 100,
)
</script>

<template>
  <div class="px-4 pt-3 lg:hidden">
    <div class="flex items-center justify-between text-xs">
      <span class="text-slate-400">Step {{ store.currentStepIndex + 1 }} of {{ STEPS.length }}</span>
      <span class="font-semibold text-slate-700">{{ store.currentStep.label }}</span>
    </div>
    <div
      class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"
      role="progressbar"
      :aria-valuenow="store.currentStepIndex + 1"
      aria-valuemin="1"
      :aria-valuemax="STEPS.length"
      :aria-label="`Step ${store.currentStepIndex + 1} of ${STEPS.length}`"
    >
      <div
        class="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-300"
        :style="{ width: `${percent}%` }"
      />
    </div>
    <div class="flex">
      <button
        v-for="(step, i) in STEPS"
        :key="step.id"
        type="button"
        class="flex h-11 flex-1 items-center justify-center"
        :aria-label="`Go to ${step.label}`"
        :aria-current="i === store.currentStepIndex ? 'step' : undefined"
        @click="store.setStep(i); playTap()"
      >
        <span
          class="rounded-full transition-all duration-200"
          :class="
            i === store.currentStepIndex
              ? 'h-2.5 w-6 bg-amber-500'
              : i < store.currentStepIndex
                ? 'h-2.5 w-2.5 bg-amber-300'
                : 'h-2.5 w-2.5 bg-slate-200'
          "
        />
      </button>
    </div>
  </div>
</template>
