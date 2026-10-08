<script setup lang="ts">
/** side-ribbon — a satin band with a bow at the front. */
const props = defineProps<{
  rx: number
  ry: number
  topY: number
  bottomY: number
  color: string
  seed?: string
}>()

const geometry = computed(() => {
  const { rx, ry, topY, bottomY } = props
  const bandW = rx * 0.22
  const y0 = topY + ry * 0.45
  const h = bottomY + ry * 0.95 - y0
  const bowY = (topY + bottomY) / 2 + ry * 0.35
  return { bandW, y0, h, bowY }
})

const shade = computed(() => darken(props.color, 14))
const glow = computed(() => lighten(props.color, 16))
</script>

<template>
  <g id="side-ribbon">
    <title>Satin ribbon and bow</title>
    <rect
      :x="-geometry.bandW / 2"
      :y="geometry.y0"
      :width="geometry.bandW"
      :height="geometry.h"
      :fill="props.color"
    />
    <rect
      :x="-geometry.bandW * 0.12"
      :y="geometry.y0"
      :width="geometry.bandW * 0.24"
      :height="geometry.h"
      :fill="glow"
      opacity="0.55"
    />
    <line
      :x1="-geometry.bandW / 2"
      :y1="geometry.y0"
      :x2="-geometry.bandW / 2"
      :y2="geometry.y0 + geometry.h"
      :stroke="shade"
      stroke-width="1"
      opacity="0.45"
    />
    <line
      :x1="geometry.bandW / 2"
      :y1="geometry.y0"
      :x2="geometry.bandW / 2"
      :y2="geometry.y0 + geometry.h"
      :stroke="shade"
      stroke-width="1"
      opacity="0.45"
    />
    <!-- bow tails -->
    <path
      :d="`M -2 ${geometry.bowY + 2} Q ${-props.rx * 0.14} ${geometry.bowY + props.rx * 0.12} ${-props.rx * 0.06} ${geometry.bowY + props.rx * 0.24} L ${props.rx * 0.03} ${geometry.bowY + props.rx * 0.2} Q ${-props.rx * 0.04} ${geometry.bowY + props.rx * 0.1} 2 ${geometry.bowY + 2} Z`"
      :fill="props.color"
      :stroke="shade"
      stroke-width="0.8"
      stroke-opacity="0.4"
    />
    <path
      :d="`M 2 ${geometry.bowY + 2} Q ${props.rx * 0.14} ${geometry.bowY + props.rx * 0.12} ${props.rx * 0.06} ${geometry.bowY + props.rx * 0.24} L ${-props.rx * 0.03} ${geometry.bowY + props.rx * 0.2} Q ${props.rx * 0.04} ${geometry.bowY + props.rx * 0.1} -2 ${geometry.bowY + 2} Z`"
      :fill="props.color"
      :stroke="shade"
      stroke-width="0.8"
      stroke-opacity="0.4"
    />
    <!-- bow loops -->
    <ellipse
      :cx="-props.rx * 0.12"
      :cy="geometry.bowY"
      :rx="props.rx * 0.13"
      :ry="props.rx * 0.07"
      :fill="props.color"
      :stroke="shade"
      stroke-width="0.8"
      stroke-opacity="0.5"
      :transform="`rotate(-16 ${-props.rx * 0.12} ${geometry.bowY})`"
    />
    <ellipse
      :cx="props.rx * 0.12"
      :cy="geometry.bowY"
      :rx="props.rx * 0.13"
      :ry="props.rx * 0.07"
      :fill="props.color"
      :stroke="shade"
      stroke-width="0.8"
      stroke-opacity="0.5"
      :transform="`rotate(16 ${props.rx * 0.12} ${geometry.bowY})`"
    />
    <ellipse
      :cx="-props.rx * 0.1"
      :cy="geometry.bowY - 1"
      :rx="props.rx * 0.06"
      :ry="props.rx * 0.03"
      :fill="glow"
      opacity="0.6"
    />
    <ellipse
      :cx="props.rx * 0.1"
      :cy="geometry.bowY - 1"
      :rx="props.rx * 0.06"
      :ry="props.rx * 0.03"
      :fill="glow"
      opacity="0.6"
    />
    <circle :cx="0" :cy="geometry.bowY" :r="props.rx * 0.045" :fill="shade" />
  </g>
</template>
