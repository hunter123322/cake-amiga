<script setup lang="ts">
/**
 * Strict 4:5 photo frame used by every shop surface. Photos in `public/img` are
 * authored at 4:5, so the frame never crops them — it only reserves the space
 * (killing layout shift) and fades the image in once decoded.
 */
const props = withDefaults(
  defineProps<{
    src?: string
    alt: string
    name?: string
    icon?: string
    sizes?: string
    priority?: boolean
  }>(),
  {
    src: undefined,
    name: '',
    icon: 'cake',
    sizes: '(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 320px',
    priority: false,
  },
)

const loaded = ref(false)
const img = ref<{ $el?: HTMLImageElement } | null>(null)

/** Images served from cache can finish before hydration, so check on mount. */
onMounted(() => {
  const el = (img.value?.$el ?? null) as HTMLImageElement | null
  if (el?.complete) loaded.value = true
})

const eagerCount = computed(() => props.priority)
</script>

<template>
  <div class="relative isolate h-full w-full overflow-hidden bg-amber-50">
    <div
      v-if="!loaded && src"
      class="absolute inset-0 animate-pulse bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100"
      aria-hidden="true"
    />
    <NuxtImg
      v-if="src"
      ref="img"
      :src="src"
      :alt="alt"
      :sizes="sizes"
      :loading="eagerCount ? 'eager' : 'lazy'"
      :fetchpriority="eagerCount ? 'high' : 'auto'"
      decoding="async"
      width="1086"
      height="1357"
      format="webp"
      class="h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out"
      :class="loaded ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'"
      @load="loaded = true"
    />
    <PhotoPending v-else :name="name" :icon="icon" />
  </div>
</template>
