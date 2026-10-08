<script setup lang="ts">
/** Whole / slice preview switch — used in the preview header (desktop) and below the preview (mobile). */
const store = useCakeStore()
</script>

<template>
  <div
    class="flex rounded-full bg-white/90 p-1 shadow-sm ring-1 ring-slate-100"
    role="group"
    aria-label="Preview view"
  >
    <button
      type="button"
      class="min-h-11 rounded-full px-4 text-xs font-semibold transition"
      :class="store.view === 'whole' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-100'"
      :aria-pressed="store.view === 'whole'"
      aria-label="Whole cake view"
      @click="store.setView('whole')"
    >
      <span class="lg:hidden">Whole cake</span>
      <span class="hidden lg:inline">Whole</span>
    </button>
    <button
      type="button"
      class="min-h-11 rounded-full px-4 text-xs font-semibold transition"
      :class="store.view === 'slice' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-100'"
      :aria-pressed="store.view === 'slice'"
      aria-label="Slice view"
      @click="store.setView('slice')"
    >
      <span class="lg:hidden">Slice view</span>
      <span class="hidden lg:inline">Slice</span>
    </button>
  </div>
</template>
