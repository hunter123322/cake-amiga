<script setup lang="ts">
const { toasts } = useToasts()
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-4"
    role="status"
    aria-live="polite"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto max-w-sm animate-pop-in rounded-full px-4 py-2 text-sm font-medium shadow-lg"
      :class="toast.tone === 'warn' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'"
    >
      {{ toast.text }}
    </div>
  </div>
</template>
