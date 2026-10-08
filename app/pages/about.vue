<script setup lang="ts">
import { SHOP_INFO, SHOP_ADDRESS_LINE } from '~/data/shop/info'

definePageMeta({ layout: 'public' })

const steps = [
  { icon: 'search', title: 'Pick your list', copy: 'Cakes, drinks, coffee or donuts — each page keeps its own prices and lead times.' },
  { icon: 'chat', title: 'Send the order', copy: 'Every card opens Messenger or Viber with the item and price already written in the message.' },
  { icon: 'clock', title: 'We confirm the time', copy: 'Cakes need three days; drinks and donuts are usually same-day.' },
  { icon: 'map-pin', title: 'Pickup or delivery', copy: `Collect in ${SHOP_INFO.address.city}, or we deliver within 10 km for ₱80 and up.` },
]

useShopSeo({
  title: 'About Cake Amiga — Bakery & Café in Bacacay, Albay',
  description:
    'A small bakery and café in Bacacay, Albay. We bake celebration cakes to order, fry doughnuts fresh every morning, and brew coffee from locally roasted Bicol beans.',
  path: '/about',
})
</script>

<template>
  <div>
    <section class="border-b border-slate-900/5 bg-gradient-to-b from-amber-50/70 to-transparent">
      <div class="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-8 pt-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 lg:pb-12 lg:pt-14">
        <div>
          <nav aria-label="Breadcrumb" class="text-xs text-slate-400">
            <ol class="flex items-center gap-1.5">
              <li><NuxtLink to="/" class="transition hover:text-slate-600">Home</NuxtLink></li>
              <li aria-hidden="true">/</li>
              <li class="font-medium text-slate-600" aria-current="page">About</li>
            </ol>
          </nav>
          <h1 class="mt-4 text-2xl font-extrabold leading-tight tracking-[-0.03em] lg:text-4xl">
            A bakery the size of one oven, in Bacacay.
          </h1>
          <div class="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-slate-600 lg:text-base">
            <p>
              We started with pandesal and a single deck oven, selling to neighbours on the way to the Bacacay public
              market. The trays grew: chiffon cakes for christenings, ensaymada on Sundays, doughnuts for the students
              who pass at four in the afternoon.
            </p>
            <p>
              Everything is still baked in {{ SHOP_INFO.address.city }}, {{ SHOP_INFO.address.province }} — the ube is
              cooked down here, the pandan is juiced here, and the coffee is roasted from beans grown in the region.
              Nothing is bought in frozen and finished off.
            </p>
            <p>
              Cakes are made to order rather than kept in a chiller, which is why we ask for three days on most designs
              and why the one you collect still smells of the oven.
            </p>
          </div>
        </div>
        <div class="relative mx-auto w-full max-w-[220px] lg:max-w-none">
          <div class="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] ring-1 ring-slate-900/5">
            <ShopImage
              src="/img/cake/floral_bouquet_cake.webp"
              alt="A hand-decorated cake from Cake Amiga"
              sizes="(max-width: 1024px) 220px, 300px"
            />
          </div>
        </div>
      </div>
    </section>

    <section aria-labelledby="how-heading" class="mx-auto w-full max-w-7xl px-4 pt-12 lg:px-8 lg:pt-16">
      <h2 id="how-heading" class="text-lg font-extrabold tracking-[-0.02em] lg:text-xl">How ordering works</h2>
      <ol class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(step, index) in steps" :key="step.title" class="rounded-3xl bg-white p-4 ring-1 ring-slate-900/5">
          <span class="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <UiIcon :name="step.icon" class="h-4 w-4" />
          </span>
          <p class="mt-3 text-sm font-bold text-slate-800">{{ index + 1 }}. {{ step.title }}</p>
          <p class="mt-1.5 text-xs leading-relaxed text-slate-500">{{ step.copy }}</p>
        </li>
      </ol>
    </section>

    <section aria-labelledby="visit-heading" class="mx-auto w-full max-w-7xl px-4 pt-12 lg:px-8 lg:pt-16">
      <div class="rounded-[32px] bg-white p-6 ring-1 ring-slate-900/5 lg:p-8">
        <h2 id="visit-heading" class="text-lg font-extrabold tracking-[-0.02em]">Where to find us</h2>
        <div class="mt-4 grid gap-6 lg:grid-cols-3">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Address</p>
            <address class="mt-2 not-italic text-sm leading-relaxed text-slate-600">{{ SHOP_ADDRESS_LINE }}</address>
            <a
              :href="SHOP_INFO.mapLink"
              target="_blank"
              rel="noopener"
              class="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              <UiIcon name="map-pin" class="h-4 w-4" />
              Open in Google Maps
            </a>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Hours</p>
            <ul class="mt-2 space-y-1.5 text-sm text-slate-600">
              <li v-for="entry in SHOP_INFO.hours" :key="entry.days">{{ entry.days }} · {{ entry.open }}</li>
            </ul>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Reach us</p>
            <ul class="mt-2 space-y-1.5 text-sm">
              <li><a :href="`tel:${SHOP_INFO.phone}`" class="text-slate-600 hover:text-slate-900">{{ SHOP_INFO.phoneDisplay }}</a></li>
              <li><a :href="SHOP_INFO.messenger" target="_blank" rel="noopener" class="text-slate-600 hover:text-slate-900">Messenger</a></li>
              <li><a :href="SHOP_INFO.viber" class="text-slate-600 hover:text-slate-900">Viber</a></li>
              <li><a :href="`mailto:${SHOP_INFO.email}`" class="text-slate-600 hover:text-slate-900">{{ SHOP_INFO.email }}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
