// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/image'],
  components: [{ path: '~/components', pathPrefix: false }],
  image: {
    // Shop photos are authored 4:5 portrait in public/img; IPX rewrites + caches variants.
    format: ['webp'],
    screens: { sm: 360, md: 480, lg: 640, xl: 960, xxl: 1280 },
  },
  // Nuxt 4.6.0 on Windows leaves the SSR renderer external, so it never receives
  // the client manifest and every SSR page 500s. See nuxt/nuxt#36467.
  // `pinia` is inlined for the same reason: an external copy gives the server a
  // second Pinia instance, so stores fail with "no active Pinia" in production.
  nitro: {
    externals: {
      inline: [
        /[\\/]node_modules[\\/]nuxt[\\/]dist[\\/]/,
        /[\\/]node_modules[\\/]pinia[\\/]/,
        /[\\/]node_modules[\\/]@pinia[\\/]/,
      ],
    },
  },
  devServer: {
    port: 3004,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en-PH' },
      title: 'Cake Amiga — Cakes, Coffee & Donuts in Bacacay, Albay',
      meta: [
        {
          name: 'description',
          content:
            'A bakery and café in Bacacay, Albay. Order cakes, donuts, coffee and drinks for pickup or delivery within 10 km — or build your own cake online.',
        },
        { name: 'theme-color', content: '#fffbeb' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },
})
