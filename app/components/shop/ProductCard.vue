<script setup lang="ts">
import type { CategorySlug, ShopProduct } from '~/types/shop'
import { CATEGORY_BY_SLUG } from '~/data/shop/categories'

const props = withDefaults(
  defineProps<{ product: ShopProduct; priority?: boolean; headingLevel?: 'h2' | 'h3' }>(),
  { priority: false, headingLevel: 'h3' },
)

/** Cake titles are hardcoded: each string matches the photograph it sits under. */
const CAKE_TITLES: Record<string, string> = {
  '/img/cake/11_shaped_floral_cake.webp': '11 Shaped Floral Cake',
  '/img/cake/80th_birthday_floral_cake.webp': '80th Birthday Floral Cake',
  '/img/cake/art_theme_bdayCake.webp': 'Art Theme Bday Cake',
  '/img/cake/assorted_mini_bento_cakes.webp': 'Assorted Mini Bento Cakes',
  '/img/cake/beach_theme_bdayCake.webp': 'Beach Theme Bday Cake',
  '/img/cake/berry_mousse_slice.webp': 'Berry Mousse Slice',
  '/img/cake/blue_crown_bdayCake.webp': 'Blue Crown Bday Cake',
  '/img/cake/brave_theme_bdayCake.webp': 'Brave Theme Bday Cake',
  '/img/cake/caramel_drip_cake.webp': 'Caramel Drip Cake',
  '/img/cake/cartoon_character_bdayCake.webp': 'Cartoon Character Bday Cake',
  '/img/cake/chef_theme_cake.webp': 'Chef Theme Cake',
  '/img/cake/cherry_pink_bdayCake.webp': 'Cherry Pink Bday Cake',
  '/img/cake/chocolate_shavings_sheet_cake.webp': 'Chocolate Shavings Sheet Cake',
  '/img/cake/christening_cake.webp': 'Christening Cake',
  '/img/cake/christening_v2_cake.webp': 'Christening V2 Cake',
  '/img/cake/crown&fruit_bento_cakes.webp': 'Crown & Fruit Bento Cakes',
  '/img/cake/double_bdayCake.webp': 'Double Bday Cake',
  '/img/cake/elegant_floral_80th_mom_bdayCake.webp': 'Elegant Floral 80th Mom Bday Cake',
  '/img/cake/elegant_white_rose_cake.webp': 'Elegant White Rose Cake',
  '/img/cake/first_bdayCake.webp': 'First Bday Cake',
  '/img/cake/floral_bouquet_cake.webp': 'Floral Bouquet Cake',
  '/img/cake/fresh_fruit_bdayCake.webp': 'Fresh Fruit Bday Cake',
  '/img/cake/fruit_cream_cakes.webp': 'Fruit Cream Cakes',
  '/img/cake/hand_drawn_bdayCake.webp': 'Hand Drawn Bday Cake',
  '/img/cake/jollibee_1st_bdayCake.webp': 'Jollibee 1st Bday Cake',
  '/img/cake/kuromi_face_bdayCake.webp': 'Kuromi Face Bday Cake',
  '/img/cake/kuromi_theme_bdayCake.webp': 'Kuromi Theme Bday Cake',
  '/img/cake/lotus_bento_cakes.webp': 'Lotus Bento Cakes',
  '/img/cake/mango_fruit_cake.webp': 'Mango Fruit Cake',
  '/img/cake/mermaid_topper_bdayCake.webp': 'Mermaid Topper Bday Cake',
  '/img/cake/mini_bento_cake_set.webp': 'Mini Bento Cake Set',
  '/img/cake/minimalist_funny_bdayCake.webp': 'Minimalist Funny Bday Cake',
  '/img/cake/number_shaped_floral_cake.webp': 'Number Shaped Floral Cake',
  '/img/cake/pastel_mini_bento_cakes.webp': 'Pastel Mini Bento Cakes',
  '/img/cake/paw_patrol_first_bdayCake.webp': 'Paw Patrol First Bday Cake',
  '/img/cake/peach_floral_80th_bdayCake.webp': 'Peach Floral 80th Bday Cake',
  '/img/cake/pink_floral_bdayCake.webp': 'Pink Floral Bday Cake',
  '/img/cake/pink_house_topper_bdayCake.webp': 'Pink House Topper Bday Cake',
  '/img/cake/pink_rose_bdayCake.webp': 'Pink Rose Bday Cake',
  '/img/cake/prince_crown_bdayCake.webp': 'Prince Crown Bday Cake',
  '/img/cake/purple_floral_sister_bdayCake.webp': 'Purple Floral Sister Bday Cake',
  '/img/cake/purple_photo_topper_bdayCake.webp': 'Purple Photo Topper Bday Cake',
  '/img/cake/rainbow_swirl_cupcakes.webp': 'Rainbow Swirl Cupcakes',
  '/img/cake/red_rose_80th_bdayCake.webp': 'Red Rose 80th Bday Cake',
  '/img/cake/red_rose_bdayCake.webp': 'Red Rose Bday Cake',
  '/img/cake/square_script_bdayCake.webp': 'Square Script Bday Cake',
  '/img/cake/the_little_mermaid_bdayCake.webp': 'The Little Mermaid Bday Cake',
  '/img/cake/tuxedo_60th_bdayCake.webp': 'Tuxedo 60th Bday Cake',
  '/img/cake/wedding_bride_cake.webp': 'Wedding Bride Cake',
  // No photo on this one, so it is keyed by slug instead.
  'custom-tiered-cake': 'Custom Tiered Cake',
}

/** The cakes that carry the hardcoded "Best Seller" badge. */
const BEST_SELLERS = new Set<string>([
  '/img/cake/assorted_mini_bento_cakes.webp',
  '/img/cake/caramel_drip_cake.webp',
  '/img/cake/chocolate_shavings_sheet_cake.webp',
  '/img/cake/kuromi_theme_bdayCake.webp',
  '/img/cake/mango_fruit_cake.webp',
  '/img/cake/paw_patrol_first_bdayCake.webp',
  '/img/cake/red_rose_bdayCake.webp',
  '/img/cake/the_little_mermaid_bdayCake.webp',
])

const store = useCatalogStore()
const { priceFromLabel, summaryLine, chips } = useProductDisplay()
const { messengerLink, viberLink, track } = useInquiry()

const isCake = computed(() => props.product.category === 'cakes')
const photo = computed(() => props.product.images[0])
const isBestSeller = computed(() => isCake.value && !!photo.value && BEST_SELLERS.has(photo.value))
const title = computed(() => {
  if (!isCake.value) return props.product.name
  return CAKE_TITLES[photo.value ?? props.product.slug] ?? props.product.name
})

const href = computed(() => `/${props.product.category}/${props.product.slug}`)
const meta = computed(() => CATEGORY_BY_SLUG[props.product.category as CategorySlug])
const icon = computed(() => meta.value.icon)
const altText = computed(() => `${title.value} — ${meta.value.label.toLowerCase()} at Cake Amiga`)
const isFavorite = computed(() => mounted.value && store.isFavorite(props.product.id))
const cardChips = computed(() => chips(props.product).slice(0, 3))

const root = ref<HTMLElement | null>(null)
/** Favourites live in local storage, so they are only known after mount. */
const mounted = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  mounted.value = true
  const el = root.value
  if (!el || typeof IntersectionObserver === 'undefined') return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        track('view_card', { item_id: props.product.id, item_name: title.value, category: props.product.category })
        observer?.disconnect()
      }
    },
    { threshold: 0.4 },
  )
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <article ref="root"
    class="group relative flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)]">
    <NuxtLink :to="href" class="relative block aspect-[4/5] w-full overflow-hidden"
      :aria-label="`${title} — view details`"
      @click="track('click_card', { item_id: product.id, item_name: title, category: product.category })">
      <ShopImage :src="photo" :alt="altText" :name="title" :icon="icon" :priority="priority" />
      <div v-if="isBestSeller" class="absolute left-3 top-3 flex flex-wrap gap-1">
        <span
          class="inline-flex items-center rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
          Best Seller
        </span>
      </div>
      <div v-else-if="!isCake && product.badges?.length" class="absolute left-3 top-3 flex flex-wrap gap-1">
        <ShopBadge v-for="badge in product.badges" :key="badge" :badge="badge" />
      </div>
    </NuxtLink>

    <button type="button"
      class="absolute right-2.5 top-2.5 flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition active:scale-95"
      :class="isFavorite ? 'bg-white text-rose-500 shadow-sm' : 'bg-white/85 text-slate-500 backdrop-blur hover:text-rose-500'"
      :aria-pressed="isFavorite" :aria-label="isFavorite ? `Remove ${title} from saved` : `Save ${title}`"
      @click="store.toggleFavorite(product.id)">
      <UiIcon name="heart" class="h-5 w-5" :class="isFavorite ? 'fill-rose-500' : ''" />
    </button>

    <div class="flex flex-1 flex-col gap-1.5 p-3.5">
      <component :is="headingLevel" class="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-slate-900">
        <NuxtLink :to="href" class="transition hover:text-amber-700">{{ title }}</NuxtLink>
      </component>
      <p class="line-clamp-2 text-xs leading-relaxed text-slate-500">{{ summaryLine(product) }}</p>
      <ul v-if="cardChips.length" class="flex flex-wrap gap-1 pt-0.5">
        <li v-for="chip in cardChips" :key="chip"
          class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium capitalize text-slate-600">{{ chip }}
        </li>
      </ul>

      <div class="mt-auto flex items-center gap-2 pt-2.5" :class="isCake ? 'justify-end' : 'justify-between'">
        <span v-if="!isCake" class="text-sm font-bold tracking-[-0.01em] text-slate-900">{{ priceFromLabel(product) }}</span>
        <div class="flex items-center gap-1">
          <a :href="viberLink(product)"
            class="hidden h-9 items-center rounded-full px-2.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 sm:inline-flex"
            aria-label="Ask about this item on Viber"
            @click="track('click_order', { item_id: product.id, channel: 'viber' })">Viber</a>
          <a :href="messengerLink(product)" target="_blank" rel="noopener"
            class="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-900 px-3 text-xs font-semibold text-white transition active:scale-[0.97] hover:bg-slate-800"
            @click="track('click_order', { item_id: product.id, channel: 'messenger' })">
            <UiIcon name="chat" class="h-3.5 w-3.5" />
            Order
          </a>
        </div>
      </div>
    </div>
  </article>
</template>
