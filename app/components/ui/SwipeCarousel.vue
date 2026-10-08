<script setup lang="ts">
interface CarouselItem {
  id: string
  [key: string]: any
}

const props = defineProps<{
  items: CarouselItem[]
  modelValue: string
  label?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const track = ref<HTMLElement | null>(null)

function scrollTo(id: string) {
  if (import.meta.server) return
  requestAnimationFrame(() => {
    track.value
      ?.querySelector<HTMLElement>(`[data-carousel-id="${id}"]`)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  })
}

function select(id: string) {
  emit('update:modelValue', id)
  scrollTo(id)
}

function onKeydown(event: KeyboardEvent) {
  const index = props.items.findIndex((item) => item.id === props.modelValue)
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    const next = props.items[Math.min(index + 1, props.items.length - 1)]
    if (next) select(next.id)
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    const prev = props.items[Math.max(index - 1, 0)]
    if (prev) select(prev.id)
  }
}
</script>

<template>
  <div
    ref="track"
    class="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 pt-1"
    role="listbox"
    :aria-label="props.label"
    tabindex="0"
    @keydown="onKeydown"
  >
    <button
      v-for="item in props.items"
      :key="item.id"
      type="button"
      role="option"
      :data-carousel-id="item.id"
      :aria-selected="item.id === props.modelValue"
      class="w-28 shrink-0 snap-center rounded-2xl border-2 bg-white/80 p-2 text-center shadow-sm transition-all duration-200"
      :class="
        item.id === props.modelValue
          ? 'scale-[1.02] border-amber-400 bg-amber-50/80 shadow-md'
          : 'border-transparent hover:border-slate-200'
      "
      @click="select(item.id)"
    >
      <slot :item="item" :selected="item.id === props.modelValue" />
    </button>
  </div>
</template>
