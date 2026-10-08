<script setup lang="ts">
const { burstKey } = useConfetti()

interface Particle {
  id: number
  round: boolean
  style: Record<string, string>
}

const active = ref(false)
const particles = ref<Particle[]>([])
let timer: ReturnType<typeof setTimeout> | null = null

const COLORS = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#a855f7', '#ec4899', '#facc15']

watch(burstKey, () => {
  if (import.meta.server) return
  particles.value = Array.from({ length: 44 }, (_, i) => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15
    const distance = 140 + Math.random() * 340
    const round = Math.random() < 0.35
    const size = 6 + Math.random() * 7
    return {
      id: Date.now() + i,
      round,
      style: {
        left: `${(50 + (Math.random() - 0.5) * 16).toFixed(1)}%`,
        top: '84%',
        width: `${size.toFixed(1)}px`,
        height: `${(size * (round ? 1 : 1.6)).toFixed(1)}px`,
        background: COLORS[Math.floor(Math.random() * COLORS.length)] ?? '#f59e0b',
        animationDelay: `${(Math.random() * 0.12).toFixed(2)}s`,
        '--tx': `${(Math.cos(angle) * distance).toFixed(0)}px`,
        '--ty': `${(Math.sin(angle) * distance).toFixed(0)}px`,
        '--rot': `${(Math.random() * 720 - 360).toFixed(0)}deg`,
      },
    }
  })
  active.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    active.value = false
  }, 1900)
})
</script>

<template>
  <div v-if="active" class="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
    <span
      v-for="particle in particles"
      :key="particle.id"
      class="absolute animate-confetti-fly"
      :class="particle.round ? 'rounded-full' : 'rounded-[2px]'"
      :style="particle.style"
    />
  </div>
</template>
