<script setup lang="ts">
import type { CoatingColor } from '~/types/cake'

const props = defineProps<{
  modelValue: string
  colors: CoatingColor[]
  label: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const isSelected = (hex: string) => hex.toLowerCase() === props.modelValue.toLowerCase()
</script>

<template>
  <fieldset>
    <legend class="text-sm font-medium text-slate-700">{{ props.label }}</legend>
    <div class="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
      <button
        v-for="color in props.colors"
        :key="color.id"
        type="button"
        :aria-pressed="isSelected(color.hex)"
        :aria-label="color.name"
        class="flex min-h-11 flex-col items-center gap-1 rounded-xl border-2 px-1 py-1.5 transition-all duration-200"
        :class="
          isSelected(color.hex)
            ? 'border-amber-400 bg-amber-50 shadow-sm'
            : 'border-transparent bg-white/70 hover:border-slate-200'
        "
        @click="emit('update:modelValue', color.hex)"
      >
        <span
          class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 shadow-inner"
          :style="{ background: color.hex }"
        >
          <UiIcon
            v-if="isSelected(color.hex)"
            name="check"
            class="h-4 w-4"
            :style="{ color: contrastText(color.hex) }"
          />
        </span>
        <span class="text-[11px] leading-none text-slate-600">{{ color.name }}</span>
      </button>
    </div>
    <label class="mt-2 flex min-h-11 cursor-pointer items-center gap-3 text-sm text-slate-600">
      Custom colour
      <input
        type="color"
        class="h-9 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
        :value="props.modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
    </label>
  </fieldset>
</template>
