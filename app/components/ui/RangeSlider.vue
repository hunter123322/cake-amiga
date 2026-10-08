<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  min: number
  max: number
  step?: number
  label: string
  unit?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()

const id = useId()
const bump = ref(false)
let bumpTimer: ReturnType<typeof setTimeout> | null = null

const display = computed(() => `${props.modelValue}${props.unit ?? ''}`)

function onInput(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  if (value === props.min || value === props.max) {
    // little bounce when the user hits a clamp boundary
    bump.value = false
    if (bumpTimer) clearTimeout(bumpTimer)
    requestAnimationFrame(() => {
      bump.value = true
      bumpTimer = setTimeout(() => (bump.value = false), 350)
    })
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between gap-3">
      <label :for="id" class="text-sm font-medium text-slate-700">{{ props.label }}</label>
      <span class="rounded-full bg-slate-900/5 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-slate-700">
        {{ display }}
      </span>
    </div>
    <input
      :id="id"
      type="range"
      class="mt-2 h-11 w-full cursor-pointer accent-amber-500"
      :class="bump ? 'animate-wiggle' : ''"
      :min="props.min"
      :max="props.max"
      :step="props.step ?? 0.5"
      :value="props.modelValue"
      @input="onInput"
    >
    <div class="-mt-1 flex justify-between text-[11px] text-slate-400">
      <span>{{ props.min }}{{ props.unit ?? '' }}</span>
      <span>{{ props.max }}{{ props.unit ?? '' }}</span>
    </div>
  </div>
</template>
