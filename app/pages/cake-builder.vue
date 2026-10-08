<script setup lang="ts">
definePageMeta({ layout: 'builder' })

const store = useCakeStore()
const route = useRoute()
const { pushToast } = useToasts()
const { playTap, toggleSound, soundEnabled } = useSound()
const { copyShareLink } = useShareLink()

useSeoMeta({
  title: 'Cake Builder — Design Your Dream Cake | Cake Amiga',
  description:
    'Build a custom cake tier by tier — size, flavour, coating, side design, topper and extras — with a live preview, instant pricing and a shareable link to send us.',
  robots: 'index, follow',
})

onMounted(() => {
  const token = route.query.c
  if (typeof token === 'string' && token) {
    if (store.fromURL(token)) {
      pushToast('Loaded your shared cake recipe')
    } else {
      pushToast('That share link looks invalid — starting fresh', 'warn')
    }
  }
})

function undo() {
  store.undo()
  playTap(520)
}

function redo() {
  store.redo()
  playTap(620)
}

function randomize() {
  store.randomize()
  playTap(760)
  pushToast('Surprise! Here is a brand new cake')
}

function flipSound() {
  toggleSound()
  if (!soundEnabled.value) pushToast('Sound muted')
}
</script>

<template>
  <div class="flex h-[100dvh] flex-col overflow-hidden lg:grid lg:grid-cols-[1fr_420px]">
    <!-- Preview stage -->
    <section class="relative flex h-[42dvh] shrink-0 flex-col lg:h-[100dvh]">
      <header class="flex items-center justify-between gap-x-3 px-3 pt-3 lg:px-6 lg:pt-5">
        <div class="min-w-0 flex-1">
          <h1 class="text-lg font-extrabold tracking-tight lg:text-2xl">Cake Builder</h1>
          <p class="hidden text-xs text-slate-400 sm:block">
            Build your cake like a game — every choice repaints the preview instantly.
          </p>
        </div>
        <div class="flex shrink-0 items-center gap-1">
          <ViewToggle class="mr-1 hidden lg:flex" />
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-30"
            :disabled="!store.canUndo"
            aria-label="Undo"
            title="Undo"
            @click="undo"
          >
            <UiIcon name="undo" class="h-5 w-5" />
          </button>
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-30"
            :disabled="!store.canRedo"
            aria-label="Redo"
            title="Redo"
            @click="redo"
          >
            <UiIcon name="redo" class="h-5 w-5" />
          </button>
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-900"
            aria-label="Surprise me — randomize the cake"
            title="Surprise me"
            @click="randomize"
          >
            <UiIcon name="dice" class="h-5 w-5" />
          </button>
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-900"
            :aria-label="soundEnabled ? 'Mute selection sounds' : 'Enable selection sounds'"
            :aria-pressed="soundEnabled"
            :title="soundEnabled ? 'Sound on' : 'Sound off'"
            @click="flipSound"
          >
            <UiIcon :name="soundEnabled ? 'sound-on' : 'sound-off'" class="h-5 w-5" />
          </button>
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-900"
            aria-label="Copy share link"
            title="Copy share link"
            @click="copyShareLink"
          >
            <UiIcon name="share" class="h-5 w-5" />
          </button>
        </div>
      </header>

      <!-- On lg the cake board rests on the bottom edge of the screen, so the
           preview gets no bottom padding and the toggle moves below the fold. -->
      <div class="flex min-h-0 flex-1 items-center justify-center px-3 pb-0 lg:px-8">
        <CakePreview class="h-full w-full" />
      </div>

      <div class="flex items-center justify-center pb-2 lg:hidden">
        <ViewToggle />
      </div>
    </section>

    <!-- Controls -->
    <aside
      class="fixed inset-x-0 bottom-0 z-20 flex h-[58dvh] flex-col rounded-t-3xl bg-white/95 shadow-2xl backdrop-blur lg:static lg:h-[100dvh] lg:rounded-none lg:shadow-none"
    >
      <div class="mx-auto mt-2 h-1.5 w-10 rounded-full bg-slate-200 lg:hidden" aria-hidden="true" />
      <Stepper />
      <ProgressBar />
      <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-2">
        <!-- Keyed swap with a CSS-only animation: content is never gated on rAF. -->
        <div :key="store.currentStep.id" class="animate-panel-in">
          <TiersPanel v-if="store.currentStep.id === 'size'" />
          <FlavorsPanel v-else-if="store.currentStep.id === 'flavor'" />
          <CoatingPanel v-else-if="store.currentStep.id === 'coating'" />
          <SideDesignPanel v-else-if="store.currentStep.id === 'side'" />
          <TopDesignPanel v-else-if="store.currentStep.id === 'top'" />
          <AddOnsPanel v-else-if="store.currentStep.id === 'extras'" />
          <ReviewPanel v-else />
        </div>
      </div>
      <PriceBar />
    </aside>
  </div>
</template>
