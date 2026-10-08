<script setup lang="ts">
import type { ProductBadge } from '~/types/shop'
import { BADGE_CLASSES, BADGE_LABELS } from '~/composables/useProductDisplay'

const props = defineProps<{ badge: ProductBadge }>()

const label = computed(() => BADGE_LABELS[props.badge])
const tone = computed(() => BADGE_CLASSES[props.badge])
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-sm"
    :class="tone"
  >{{ label }}</span>
</template>
