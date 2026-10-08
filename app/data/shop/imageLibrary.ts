/**
 * Files present in `public/img`, grouped by the category they were shot for —
 * a hardcoded index of the photography on hand.
 *
 * Every file is authored 4:5 portrait (e.g. 1086 × 1357) and the UI enforces that
 * ratio, so photos never need cropping by hand. Cake file names double as product
 * names — see `cakes.ts`, which lists its own paths.
 */
export const IMAGE_LIBRARY: Record<string, string[]> = {
  cakes: [
    '/img/cake/11_shaped_floral_cake.webp',
    '/img/cake/80th_birthday_floral_cake.webp',
    '/img/cake/art_theme_bdayCake.webp',
    '/img/cake/assorted_mini_bento_cakes.webp',
    '/img/cake/beach_theme_bdayCake.webp',
    '/img/cake/berry_mousse_slice.webp',
    '/img/cake/blue_crown_bdayCake.webp',
    '/img/cake/brave_theme_bdayCake.webp',
    '/img/cake/caramel_drip_cake.webp',
    '/img/cake/cartoon_character_bdayCake.webp',
    '/img/cake/chef_theme_cake.webp',
    '/img/cake/cherry_pink_bdayCake.webp',
    '/img/cake/chocolate_shavings_sheet_cake.webp',
    '/img/cake/christening_cake.webp',
    '/img/cake/christening_v2_cake.webp',
    '/img/cake/crown&fruit_bento_cakes.webp',
    '/img/cake/double_bdayCake.webp',
    '/img/cake/elegant_floral_80th_mom_bdayCake.webp',
    '/img/cake/elegant_white_rose_cake.webp',
    '/img/cake/first_bdayCake.webp',
    '/img/cake/floral_bouquet_cake.webp',
    '/img/cake/fresh_fruit_bdayCake.webp',
    '/img/cake/fruit_cream_cakes.webp',
    '/img/cake/hand_drawn_bdayCake.webp',
    '/img/cake/jollibee_1st_bdayCake.webp',
    '/img/cake/kuromi_face_bdayCake.webp',
    '/img/cake/kuromi_theme_bdayCake.webp',
    '/img/cake/lotus_bento_cakes.webp',
    '/img/cake/mango_fruit_cake.webp',
    '/img/cake/mermaid_topper_bdayCake.webp',
    '/img/cake/mini_bento_cake_set.webp',
    '/img/cake/minimalist_funny_bdayCake.webp',
    '/img/cake/number_shaped_floral_cake.webp',
    '/img/cake/pastel_mini_bento_cakes.webp',
    '/img/cake/paw_patrol_first_bdayCake.webp',
    '/img/cake/peach_floral_80th_bdayCake.webp',
    '/img/cake/pink_floral_bdayCake.webp',
    '/img/cake/pink_house_topper_bdayCake.webp',
    '/img/cake/pink_rose_bdayCake.webp',
    '/img/cake/prince_crown_bdayCake.webp',
    '/img/cake/purple_floral_sister_bdayCake.webp',
    '/img/cake/purple_photo_topper_bdayCake.webp',
    '/img/cake/rainbow_swirl_cupcakes.webp',
    '/img/cake/red_rose_80th_bdayCake.webp',
    '/img/cake/red_rose_bdayCake.webp',
    '/img/cake/square_script_bdayCake.webp',
    '/img/cake/the_little_mermaid_bdayCake.webp',
    '/img/cake/tuxedo_60th_bdayCake.webp',
    '/img/cake/wedding_bride_cake.webp',
  ],
  donuts: ['/img/donut/donut1.webp', '/img/donut/donut2.webp'],
  drinks: ['/img/drink/drink1.webp', '/img/drink/drink2.webp'],
  coffee: [],
  bread: [],
}

export const IMAGE_LIBRARY_ALL = Object.values(IMAGE_LIBRARY).flat()
