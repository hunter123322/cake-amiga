<script setup lang="ts">
import { CATEGORIES } from '~/data/shop/categories'
import { SHOP_INFO, SHOP_ADDRESS_LINE } from '~/data/shop/info'

definePageMeta({ layout: 'public' })

const faqs = [
  {
    q: 'How far ahead should I order a cake?',
    a: 'Three days for the designs on this site, seven for tiered or custom work. If you need something sooner, message us — we sometimes have a spare cake in the chiller.',
  },
  {
    q: 'Do you deliver outside Bacacay?',
    a: 'We deliver within about 30 km: Bacacay, Malinao, Sto. Domingo and parts of Legazpi. Beyond that we can meet you at a landmark along the road.',
  },
  {
    q: 'Can I pay online?',
    a: 'Orders are confirmed over Messenger, Viber or the phone, and paid on pickup or on delivery — cash, GCash or bank transfer.',
  },
  {
    q: 'Do you make cakes without egg or with less sugar?',
    a: 'Some recipes can be adjusted. Tell us the allergy or the preference when you message and we will be honest about what we can safely do.',
  },
]

const channels = [
  { icon: 'chat', title: 'Messenger', copy: 'Fastest for photos and design sketches.', href: SHOP_INFO.messenger, label: 'Open Messenger' },
  { icon: 'chat', title: 'Viber', copy: 'Good for quick confirmations and delivery updates.', href: SHOP_INFO.viber, label: 'Open Viber' },
  { icon: 'phone', title: 'Phone', copy: 'Best for same-day pickup and large trays.', href: `tel:${SHOP_INFO.phone}`, label: SHOP_INFO.phoneDisplay },
  { icon: 'mail', title: 'E-mail', copy: 'For quotes, invoices and bulk orders.', href: `mailto:${SHOP_INFO.email}`, label: SHOP_INFO.email },
]

useShopSeo({
  title: 'Contact Cake Amiga — Bacacay, Albay',
  description:
    'Contact us in Bacacay, Albay: Messenger, Viber, phone and e-mail, opening hours, pickup address and delivery coverage within 10 km. Order cakes, donuts and coffee.',
  path: '/contact',
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ],
})

</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-4 pb-16 pt-7 lg:px-8 lg:pt-12">
    <nav aria-label="Breadcrumb" class="text-xs text-slate-400">
      <ol class="flex items-center gap-1.5">
        <li><NuxtLink to="/" class="transition hover:text-slate-600">Home</NuxtLink></li>
        <li aria-hidden="true">/</li>
        <li class="font-medium text-slate-600" aria-current="page">Contact</li>
      </ol>
    </nav>

    <header class="mt-4 max-w-2xl">
      <h1 class="text-2xl font-extrabold leading-tight tracking-[-0.03em] lg:text-4xl">Talk to the bakery</h1>
      <p class="mt-2.5 text-sm leading-relaxed text-slate-600 lg:text-base">
        We are in {{ SHOP_INFO.address.city }}, {{ SHOP_INFO.address.province }} — pick up, or let us bring it over.
        Message before 8:00 PM and we can usually bake for the next morning.
      </p>
    </header>

    <div class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
      <div class="flex flex-col gap-8">
        <section aria-labelledby="channels-heading">
          <h2 id="channels-heading" class="text-lg font-extrabold tracking-[-0.02em]">Ways to order</h2>
          <ul class="mt-4 grid gap-3 sm:grid-cols-2">
            <li v-for="channel in channels" :key="channel.title" class="flex flex-col rounded-3xl bg-white p-4 ring-1 ring-slate-900/5">
              <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <UiIcon :name="channel.icon" class="h-5 w-5" />
              </span>
              <p class="mt-3 text-sm font-bold text-slate-800">{{ channel.title }}</p>
              <p class="mt-1 text-xs leading-relaxed text-slate-500">{{ channel.copy }}</p>
              <a
                :href="channel.href"
                :target="channel.href.startsWith('http') ? '_blank' : undefined"
                rel="noopener"
                class="mt-auto pt-3 text-sm font-semibold text-amber-700 hover:text-amber-800"
              >{{ channel.label }}</a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" class="text-lg font-extrabold tracking-[-0.02em]">Before you order</h2>
          <dl class="mt-4 divide-y divide-slate-200 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-900/5">
            <div v-for="faq in faqs" :key="faq.q" class="p-4">
              <dt class="text-sm font-bold text-slate-800">{{ faq.q }}</dt>
              <dd class="mt-1.5 text-sm leading-relaxed text-slate-500">{{ faq.a }}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="shop-heading" class="rounded-3xl bg-white p-5 ring-1 ring-slate-900/5">
          <h2 id="shop-heading" class="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Order by list</h2>
          <ul class="mt-3 flex flex-wrap gap-2">
            <li v-for="category in CATEGORIES" :key="category.slug">
              <NuxtLink
                :to="`/${category.slug}`"
                class="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-50 px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <UiIcon :name="category.icon" class="h-4 w-4" />
                {{ category.label }}
              </NuxtLink>
            </li>
          </ul>
        </section>
      </div>

      <aside class="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <div class="rounded-3xl bg-gradient-to-br from-amber-50 to-rose-50 p-5 ring-1 ring-white/60">
          <h2 class="text-sm font-bold text-slate-900">Pickup & delivery</h2>
          <address class="mt-2 not-italic text-sm leading-relaxed text-slate-600">{{ SHOP_ADDRESS_LINE }}</address>
          <p class="mt-2 text-xs leading-relaxed text-slate-500">{{ SHOP_INFO.pickupNote }}</p>
          <p class="mt-1 text-xs leading-relaxed text-slate-500">{{ SHOP_INFO.deliveryNote }}</p>
          <a
            :href="SHOP_INFO.mapLink"
            target="_blank"
            rel="noopener"
            class="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition active:scale-[0.97] hover:bg-slate-800"
          >
            <UiIcon name="map-pin" class="h-4 w-4" />
            Open in Google Maps
          </a>
        </div>

        <div class="rounded-3xl bg-white p-5 ring-1 ring-slate-900/5">
          <h2 class="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Opening hours</h2>
          <ul class="mt-3 space-y-2 text-sm text-slate-600">
            <li v-for="entry in SHOP_INFO.hours" :key="entry.days" class="flex items-start justify-between gap-3">
              <span>{{ entry.days }}</span>
              <span class="text-right font-medium text-slate-800">{{ entry.open }}</span>
            </li>
          </ul>
          <p class="mt-3 text-xs text-slate-400">Closed on All Souls’ Day and Christmas Day.</p>
        </div>

        <div class="rounded-3xl bg-white p-5 ring-1 ring-slate-900/5">
          <h2 class="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Follow</h2>
          <ul class="mt-3 flex flex-wrap gap-2 text-sm">
            <li v-for="social in SHOP_INFO.socials" :key="social.label">
              <a
                :href="social.url"
                target="_blank"
                rel="noopener"
                class="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-50 px-3.5 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <UiIcon :name="social.label.toLowerCase()" class="h-4 w-4" />
                {{ social.label }}
              </a>
            </li>
          </ul>
          <p class="mt-3 text-xs leading-relaxed text-slate-500">
            Daily trays, sold-out notices and holiday schedules get posted there first.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>
