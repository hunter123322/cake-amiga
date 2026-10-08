<script setup lang="ts">
import { CATEGORIES } from '~/data/shop/categories'
import { SHOP_INFO, SHOP_ADDRESS_LINE } from '~/data/shop/info'
import { localBusinessJsonLd } from '~/composables/useShopSeo'

const route = useRoute()
const drawerOpen = ref(false)

const primaryNav = [
  { label: 'Home', to: '/' },
  ...CATEGORIES.map((category) => ({ label: category.label, to: `/${category.slug}` })),
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const bottomNav = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Cakes', to: '/cakes', icon: 'cake' },
  { label: 'Menu', to: '/menu', icon: 'grid' },
  { label: 'Contact', to: '/contact', icon: 'chat' },
  { label: 'Build', to: '/cake-builder', icon: 'sparkle' },
]

const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

watch(
  () => route.fullPath,
  () => {
    drawerOpen.value = false
  },
)

watch(drawerOpen, (open) => {
  if (import.meta.client) document.documentElement.style.overflow = open ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.style.overflow = ''
})

const year = new Date().getFullYear()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(localBusinessJsonLd()),
    },
  ],
})
</script>

<template>
  <div class="flex min-h-[100dvh] flex-col bg-[#fffdf9] text-slate-900">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
    >Skip to content</a>

    <header class="sticky top-0 z-40 border-b border-white/50 bg-white/75 backdrop-blur-xl">
      <div class="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-4 lg:h-16 lg:gap-4 lg:px-8">
        <NuxtLink to="/" class="flex shrink-0 items-center gap-2" aria-label="Cake Amiga — home">
          <NuxtImg
            src="/android-chrome-192x192.png"
            alt=""
            width="36"
            height="36"
            format="webp"
            class="h-9 w-9 shrink-0 object-contain"
            loading="eager"
            fetchpriority="high"
          />
          <span class="text-[15px] font-extrabold tracking-[-0.02em]">{{ SHOP_INFO.name }}</span>
        </NuxtLink>

        <nav aria-label="Primary" class="ml-2 hidden items-center gap-0.5 lg:flex">
          <NuxtLink
            v-for="item in primaryNav"
            :key="item.to"
            :to="item.to"
            class="rounded-full px-3 py-2 text-sm font-medium transition"
            :class="isActive(item.to) ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            :aria-current="isActive(item.to) ? 'page' : undefined"
          >{{ item.label }}</NuxtLink>
        </nav>

        <div class="ml-auto flex items-center gap-1.5">
          <NuxtLink
            to="/cake-builder"
            class="hidden h-10 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-semibold text-amber-800 transition active:scale-[0.97] hover:bg-amber-200 lg:inline-flex"
          >
            <UiIcon name="sparkle" class="h-4 w-4" />
            Build your own
          </NuxtLink>
          <a
            :href="SHOP_INFO.messenger"
            target="_blank"
            rel="noopener"
            class="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-900 px-3.5 text-sm font-semibold text-white transition active:scale-[0.97] hover:bg-slate-800"
          >
            <UiIcon name="chat" class="h-4 w-4" />
            Order
          </a>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 lg:hidden"
            :aria-expanded="drawerOpen"
            aria-controls="shop-drawer"
            aria-label="Open menu"
            @click="drawerOpen = !drawerOpen"
          >
            <UiIcon :name="drawerOpen ? 'close' : 'menu'" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        v-if="drawerOpen"
        id="shop-drawer"
        class="lg:hidden"
      >
        <div class="mx-4 mb-3 rounded-3xl bg-white/95 p-3 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.5)] ring-1 ring-slate-900/5">
          <nav aria-label="All pages" class="grid grid-cols-2 gap-1.5">
            <NuxtLink
              v-for="category in CATEGORIES"
              :key="category.slug"
              :to="`/${category.slug}`"
              class="flex items-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition"
              :class="isActive(`/${category.slug}`) ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'"
            >
              <UiIcon :name="category.icon" class="h-4 w-4" />
              {{ category.label }}
            </NuxtLink>
            <NuxtLink to="/cake-builder" class="flex items-center gap-2 rounded-2xl bg-amber-100 px-3 py-3 text-sm font-semibold text-amber-800">
              <UiIcon name="sparkle" class="h-4 w-4" />
              Build your own
            </NuxtLink>
            <NuxtLink to="/menu" class="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
              <UiIcon name="grid" class="h-4 w-4" />
              Full menu
            </NuxtLink>
            <NuxtLink to="/about" class="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
              <UiIcon name="leaf" class="h-4 w-4" />
              About
            </NuxtLink>
            <NuxtLink to="/contact" class="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
              <UiIcon name="map-pin" class="h-4 w-4" />
              Contact
            </NuxtLink>
          </nav>
          <div class="mt-2 grid grid-cols-3 gap-1.5">
            <a :href="`tel:${SHOP_INFO.phone}`" class="flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-white text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              <UiIcon name="phone" class="h-4 w-4" />Call
            </a>
            <a :href="SHOP_INFO.viber" class="flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-white text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              <UiIcon name="chat" class="h-4 w-4" />Viber
            </a>
            <a :href="SHOP_INFO.messenger" target="_blank" rel="noopener" class="flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-white text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              <UiIcon name="chat" class="h-4 w-4" />Messenger
            </a>
          </div>
        </div>
      </div>
    </header>

    <slot name="hero" />

    <main id="main" class="flex-1 pb-24 lg:pb-0">
      <slot />
    </main>

    <footer class="border-t border-slate-900/5 bg-white/70 pb-24 pt-12 lg:pb-12">
      <div class="mx-auto grid w-full max-w-7xl gap-10 px-4 lg:grid-cols-4 lg:px-8">
        <div class="lg:col-span-2">
          <p class="text-lg font-extrabold tracking-[-0.02em]">{{ SHOP_INFO.legalName }}</p>
          <p class="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{{ SHOP_INFO.tagline }}</p>
          <address class="mt-4 not-italic text-sm leading-relaxed text-slate-600">
            <a :href="SHOP_INFO.mapLink" target="_blank" rel="noopener" class="inline-flex items-start gap-2 hover:text-slate-900">
              <UiIcon name="map-pin" class="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <span>{{ SHOP_ADDRESS_LINE }}</span>
            </a>
          </address>
          <p class="mt-3 text-xs text-slate-500">{{ SHOP_INFO.pickupNote }} {{ SHOP_INFO.deliveryNote }}</p>
        </div>

        <div>
          <h2 class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Shop</h2>
          <ul class="mt-3 space-y-2 text-sm">
            <li v-for="category in CATEGORIES" :key="category.slug">
              <NuxtLink :to="`/${category.slug}`" class="text-slate-600 transition hover:text-slate-900">{{ category.label }}</NuxtLink>
            </li>
            <li><NuxtLink to="/menu" class="text-slate-600 transition hover:text-slate-900">Full menu</NuxtLink></li>
            <li><NuxtLink to="/cake-builder" class="text-amber-700 transition hover:text-amber-800">Build your own cake</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-slate-600 transition hover:text-slate-900">About</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-slate-600 transition hover:text-slate-900">Contact</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h2 class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Visit & order</h2>
          <ul class="mt-3 space-y-2 text-sm text-slate-600">
            <li v-for="entry in SHOP_INFO.hours" :key="entry.days" class="flex items-center gap-2">
              <UiIcon name="clock" class="h-4 w-4 text-amber-600" />
              <span>{{ entry.days }} · {{ entry.open }}</span>
            </li>
          </ul>
          <div class="mt-4 flex flex-wrap gap-2">
            <a :href="`tel:${SHOP_INFO.phone}`" class="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-3.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:text-slate-900">
              <UiIcon name="phone" class="h-4 w-4" />{{ SHOP_INFO.phoneDisplay }}
            </a>
            <a :href="SHOP_INFO.messenger" target="_blank" rel="noopener" class="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-900 px-3.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              <UiIcon name="chat" class="h-4 w-4" />Messenger
            </a>
            <a :href="SHOP_INFO.viber" class="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-3.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:text-slate-900">
              <UiIcon name="chat" class="h-4 w-4" />Viber
            </a>
          </div>
          <p class="mt-4 flex gap-3 text-sm">
            <a v-for="social in SHOP_INFO.socials" :key="social.label" :href="social.url" target="_blank" rel="noopener" class="text-slate-500 transition hover:text-slate-900">
              {{ social.label }}
            </a>
          </p>
        </div>
      </div>

      <div class="mx-auto mt-10 w-full max-w-7xl px-4 text-xs text-slate-400 lg:px-8">
        <p>© {{ year }} {{ SHOP_INFO.legalName }} · Bacacay, Albay, Philippines · Baked in Bicol.</p>
      </div>
    </footer>

    <nav
      aria-label="Quick navigation"
      class="fixed inset-x-0 bottom-0 z-40 border-t border-white/60 bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul class="mx-auto flex max-w-md items-stretch justify-between px-2">
        <li v-for="item in bottomNav" :key="item.to" class="flex-1">
          <NuxtLink
            :to="item.to"
            class="flex h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition"
            :class="isActive(item.to) ? 'text-amber-700' : 'text-slate-500'"
            :aria-current="isActive(item.to) ? 'page' : undefined"
          >
            <UiIcon :name="item.icon" class="h-5 w-5" />
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
