<script setup lang="ts">
withDefaults(defineProps<{ title?: string; message: string; icon?: string; actionLabel?: string }>(), {
  title: 'Nothing here yet',
  icon: 'search',
  actionLabel: '',
})

const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 rounded-3xl bg-white/70 px-6 py-14 text-center ring-1 ring-slate-900/5">
    <span class="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
      <UiIcon :name="icon" class="h-7 w-7" />
    </span>
    <h3 class="text-base font-semibold text-slate-900">{{ title }}</h3>
    <p class="max-w-sm text-sm leading-relaxed text-slate-500">{{ message }}</p>
    <button
      v-if="actionLabel"
      type="button"
      class="mt-1 h-11 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition active:scale-[0.97] hover:bg-slate-800"
      @click="emit('action')"
    >{{ actionLabel }}</button>
  </div>
</template>
