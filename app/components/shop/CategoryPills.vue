<script setup lang="ts">
import { CATEGORIES } from '~/data/shop/categories'

const route = useRoute()
const active = computed(() => route.path.split('/')[1] ?? '')
</script>

<template>
  <nav aria-label="Shop categories" class="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <NuxtLink
      v-for="category in CATEGORIES"
      :key="category.slug"
      :to="`/${category.slug}`"
      class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition active:scale-[0.97]"
      :class="
        active === category.slug
          ? 'bg-slate-900 text-white shadow-sm'
          : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-900 hover:ring-slate-300'
      "
      :aria-current="active === category.slug ? 'page' : undefined"
    >
      <UiIcon :name="category.icon" class="h-4 w-4" />
      {{ category.label }}
    </NuxtLink>
  </nav>
</template>
