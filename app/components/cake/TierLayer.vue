<script setup lang="ts">
import type { Coating, SideDesign, Tier } from '~/types/cake'
import type { TierGeometry } from '~/composables/useCakeGeometry'
import { getFlavor } from '~/data/flavors'

const props = defineProps<{
  geom: TierGeometry
  tier: Tier
  coating: Coating
  sideDesign: SideDesign
  selected: boolean
  slice: boolean
}>()

const emit = defineEmits<{ (e: 'select'): void }>()

const focused = ref(false)

const flavor = computed(() => getFlavor(props.tier.flavorId))
const topFill = computed(() => lighten(props.coating.color, 10))
const rimStroke = computed(() => darken(props.coating.color, 12))
const selectStroke = computed(() => darken(props.coating.color, 34))

const wedgePath = computed(() =>
  buildWedgePath(props.geom.rx, props.geom.ry, props.geom.topY, props.geom.bottomY),
)

const cutLine = computed(() => {
  const points = wedgePoints(props.geom.rx, props.geom.ry, props.geom.topY, props.geom.bottomY)
  return { a: points[0], b: points[3] }
})

/** Sponge / filling layers revealed by the slice view. */
const bands = computed(() => {
  const { topY, bottomY, ry } = props.geom
  const y0 = topY + ry * 0.95
  const y1 = bottomY + ry * 0.92
  const total = y1 - y0
  const ratios = [0.24, 0.16, 0.24, 0.16, 0.2]
  const list: Array<{ y: number; h: number; fill: string; key: number }> = []
  let y = y0
  ratios.forEach((ratio, i) => {
    const h = total * ratio
    list.push({ y, h, fill: i % 2 === 0 ? flavor.value.sponge : flavor.value.cream, key: i })
    y += h
  })
  return list
})

const bandSeparator = computed(() => darken(flavor.value.sponge, 18))
const highlight = computed(() => (props.selected || focused.value ? selectStroke.value : 'none'))
</script>

<template>
  <g
    :id="`tier-${props.geom.index}`"
    class="cursor-pointer"
    role="button"
    tabindex="0"
    :aria-label="`Select tier ${props.geom.index + 1}`"
    @click="emit('select')"
    @keydown.enter.prevent="emit('select')"
    @keydown.space.prevent="emit('select')"
    @focus="focused = true"
    @blur="focused = false"
  >
    <defs>
      <clipPath :id="props.geom.clipId">
        <path :d="props.geom.bodyPath" />
      </clipPath>
      <clipPath :id="props.geom.wedgeClipId">
        <path :d="wedgePath" />
      </clipPath>
    </defs>

    <!-- 1. body -->
    <path :d="props.geom.bodyPath" :fill="props.coating.color" />

    <!-- 2. shading + coating texture + side design, clipped to the body -->
    <g :clip-path="`url(#${props.geom.clipId})`">
      <rect
        :x="-props.geom.rx"
        :y="props.geom.topY - props.geom.ry"
        :width="props.geom.rx * 2"
        :height="props.geom.bodyH + props.geom.ry * 2"
        fill="url(#body-shine)"
        pointer-events="none"
      />
      <rect
        :x="-props.geom.rx"
        :y="props.geom.topY - props.geom.ry"
        :width="props.geom.rx * 2"
        :height="props.geom.bodyH + props.geom.ry * 2"
        fill="url(#body-shade)"
        pointer-events="none"
      />
      <CoatingLayer
        :finish="props.coating.finish"
        :color="props.coating.color"
        :rx="props.geom.rx"
        :ry="props.geom.ry"
        :top-y="props.geom.topY"
        :bottom-y="props.geom.bottomY"
        :seed="props.geom.id"
      />
      <SideDesignLayer
        v-if="props.sideDesign.id !== 'side-none'"
        :id="props.sideDesign.id"
        :color="props.sideDesign.color"
        :message="props.sideDesign.message"
        :rx="props.geom.rx"
        :ry="props.geom.ry"
        :top-y="props.geom.topY"
        :bottom-y="props.geom.bottomY"
        :seed="props.geom.id"
      />
    </g>

    <!-- 3. slice view — flavour layers in the front-right wedge -->
    <g v-if="props.slice" :clip-path="`url(#${props.geom.clipId})`" pointer-events="none">
      <g :clip-path="`url(#${props.geom.wedgeClipId})`">
        <rect
          v-for="band in bands"
          :key="band.key"
          :x="-props.geom.rx"
          :y="band.y"
          :width="props.geom.rx * 2"
          :height="band.h"
          :fill="band.fill"
        />
        <line
          v-for="band in bands.slice(1)"
          :key="`sep-${band.key}`"
          :x1="-props.geom.rx"
          :y1="band.y"
          :x2="props.geom.rx"
          :y2="band.y"
          :stroke="bandSeparator"
          stroke-width="1"
          opacity="0.35"
        />
        <rect
          :x="-props.geom.rx"
          :y="props.geom.topY"
          :width="props.geom.rx * 2"
          :height="props.geom.bodyH + props.geom.ry"
          fill="#000000"
          opacity="0.05"
        />
        <line
          :x1="cutLine.a.x"
          :y1="cutLine.a.y"
          :x2="cutLine.b.x"
          :y2="cutLine.b.y"
          stroke="#ffffff"
          stroke-width="1.6"
          opacity="0.6"
        />
      </g>
    </g>

    <!-- 4. top surface -->
    <ellipse
      :cx="0"
      :cy="props.geom.topY"
      :rx="props.geom.rx"
      :ry="props.geom.ry"
      :fill="topFill"
      :stroke="rimStroke"
      stroke-width="1.2"
      stroke-opacity="0.55"
      pointer-events="none"
    />

    <!-- 5. selection / focus outline -->
    <g v-if="highlight !== 'none'" pointer-events="none">
      <path
        :d="props.geom.bodyPath"
        fill="none"
        :stroke="highlight"
        stroke-width="3"
        stroke-dasharray="11 7"
        opacity="0.85"
      />
      <ellipse
        :cx="0"
        :cy="props.geom.topY"
        :rx="props.geom.rx"
        :ry="props.geom.ry"
        fill="none"
        :stroke="highlight"
        stroke-width="2"
        stroke-dasharray="7 5"
        opacity="0.85"
      />
    </g>
  </g>
</template>
