<script setup lang="ts">
/** side-piping-scallop — classic shell border wrapping the base. */
const props = defineProps<{
  rx: number
  ry: number
  topY: number
  bottomY: number
  color: string
  seed?: string
}>()

interface Point {
  x: number
  y: number
}

const quad = (a: Point, c: Point, b: Point, t: number): Point => ({
  x: (1 - t) ** 2 * a.x + 2 * t * (1 - t) * c.x + t ** 2 * b.x,
  y: (1 - t) ** 2 * a.y + 2 * t * (1 - t) * c.y + t ** 2 * b.y,
})

const shells = computed(() => {
  const { rx, ry, bottomY } = props
  const n = Math.max(5, Math.round(rx / 9))
  const segments = rimSegments(rx, ry, bottomY, n + 1, 0.93)
  const list: Array<{ d: string; ribs: string[] }> = []
  for (const { a, b } of segments) {
    const bulge = ry * 0.55 + 6
    const midX = (a.x + b.x) / 2
    const midY = Math.max(a.y, b.y) + bulge
    const ctrl = { x: midX, y: 2 * midY - (a.y + b.y) / 2 }
    const ribs: string[] = []
    for (const t of [0.28, 0.5, 0.72]) {
      const chord = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
      const curve = quad(a, ctrl, b, t)
      ribs.push(`M ${chord.x.toFixed(1)} ${chord.y.toFixed(1)} L ${curve.x.toFixed(1)} ${(curve.y - 1.5).toFixed(1)}`)
    }
    list.push({
      d: `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${ctrl.x.toFixed(1)} ${ctrl.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)} Q ${ctrl.x.toFixed(1)} ${ctrl.y.toFixed(1)} ${a.x.toFixed(1)} ${a.y.toFixed(1)} Z`,
      ribs,
    })
  }
  return list
})

const edge = computed(() => darken(props.color, 14))
</script>

<template>
  <g id="side-piping-scallop">
    <title>Scalloped shell border</title>
    <template v-for="(shell, i) in shells" :key="i">
      <path :d="shell.d" :fill="props.color" :stroke="edge" stroke-width="0.7" stroke-opacity="0.4" />
      <path
        v-for="(rib, j) in shell.ribs"
        :key="`r-${i}-${j}`"
        :d="rib"
        fill="none"
        :stroke="edge"
        stroke-width="0.8"
        stroke-linecap="round"
        opacity="0.35"
      />
    </template>
  </g>
</template>
