<script setup lang="ts">
withDefaults(defineProps<{ name?: string; icon?: string; note?: string }>(), {
  name: '',
  icon: 'cake',
  note: 'Photo coming soon',
})
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 text-center">
    <span class="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-amber-500 ring-1 ring-amber-100">
      <UiIcon :name="icon" class="h-6 w-6" />
    </span>
    <p v-if="name" class="text-sm font-semibold leading-snug text-slate-600">{{ name }}</p>
    <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600/80">{{ note }}</p>
  </div>
</template>
