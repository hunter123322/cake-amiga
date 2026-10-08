import type { Tier } from '~/types/cake'

/** 1 inch = 12 SVG units. */
export const SCALE = 12
/** ry = rx * ELLIPSE_RATIO — the fixed, front-facing top-down tilt. */
export const ELLIPSE_RATIO = 0.2
/** Breathing room around the scene in the auto-fitted viewBox. */
export const VIEW_PAD = 40
/** Smaller bottom pad so the cake board rests on the bottom edge of the preview. */
export const VIEW_PAD_BOTTOM = 4

export interface TierGeometry {
  id: string
  index: number
  isTop: boolean
  rx: number
  ry: number
  bodyH: number
  /** Y of the bottom rim's ellipse centre. */
  bottomY: number
  /** Y of the top rim's ellipse centre. */
  topY: number
  bodyPath: string
  clipId: string
  wedgeClipId: string
}

export interface PlateGeometry {
  cx: number
  cy: number
  rx: number
  ry: number
}

export interface Point {
  x: number
  y: number
}

export interface SceneLayout {
  tiers: TierGeometry[]
  plate: PlateGeometry
  groundY: number
  viewBox: string
  maxRx: number
  topRx: number
  topRy: number
  topCenterY: number
}

const f = (n: number) => Math.round(n * 100) / 100

/** Tier shape cache — a tier only rebuilds its path when its own inputs change. */
const pathCache = new Map<string, string>()

function bodyPathFor(rx: number, ry: number, topY: number, bottomY: number): string {
  const key = `${rx}|${ry}|${topY}|${bottomY}`
  let path = pathCache.get(key)
  if (!path) {
    if (pathCache.size > 400) pathCache.clear()
    path = [
      `M ${f(-rx)} ${f(bottomY)}`,
      `L ${f(-rx)} ${f(topY)}`,
      `A ${f(rx)} ${f(ry)} 0 0 1 ${f(rx)} ${f(topY)}`,
      `L ${f(rx)} ${f(bottomY)}`,
      `A ${f(rx)} ${f(ry)} 0 0 1 ${f(-rx)} ${f(bottomY)}`,
      'Z',
    ].join(' ')
    pathCache.set(key, path)
  }
  return path
}

/**
 * Cylinder body silhouette path. The top arc follows the back rim of the top
 * ellipse, the bottom arc the front rim of the bottom ellipse.
 */
export function buildBodyPath(rx: number, ry: number, topY: number, bottomY: number): string {
  return bodyPathFor(rx, ry, topY, bottomY)
}

/** Clip polygon for the slice-view wedge (front-right quadrant). */
export function wedgePoints(
  rx: number,
  ry: number,
  topY: number,
  bottomY: number,
): [Point, Point, Point, Point] {
  const overflow = 8
  return [
    { x: -rx * 0.04, y: topY + ry * 0.95 },
    { x: rx + overflow, y: topY + ry * 0.1 },
    { x: rx + overflow, y: bottomY + ry * 0.9 },
    { x: rx * 0.08, y: bottomY + ry * 0.55 },
  ]
}

/** Clip region for the slice-view wedge (front-right quadrant). */
export function buildWedgePath(rx: number, ry: number, topY: number, bottomY: number): string {
  const [a, b, c, d] = wedgePoints(rx, ry, topY, bottomY)
  return [
    `M ${f(a.x)} ${f(a.y)}`,
    `L ${f(b.x)} ${f(b.y)}`,
    `L ${f(c.x)} ${f(c.y)}`,
    `L ${f(d.x)} ${f(d.y)}`,
    'Z',
  ].join(' ')
}

export interface SceneOptions {
  /** Top design height allowance, as a multiple of the top tier rx. */
  topElevation: number
  /** True when any add-on sits beside the cake on the table. */
  hasSideAddOns: boolean
  /** Gift box needs extra room on the right. */
  hasBox: boolean
}

/** Full scene layout: tier stack (index 0 = bottom), plate, and auto-fit viewBox. */
export function buildSceneLayout(tiers: Tier[], options: SceneOptions): SceneLayout {
  const geometries: TierGeometry[] = []
  let bottomY = 0
  let maxRx = 0

  tiers.forEach((tier, index) => {
    const rx = (tier.diameterIn * SCALE) / 2
    const ry = rx * ELLIPSE_RATIO
    const bodyH = tier.heightIn * SCALE
    const topY = bottomY - bodyH
    maxRx = Math.max(maxRx, rx)
    geometries.push({
      id: tier.id,
      index,
      isTop: index === tiers.length - 1,
      rx,
      ry,
      bodyH,
      bottomY,
      topY,
      bodyPath: bodyPathFor(rx, ry, topY, bottomY),
      clipId: `body-clip-${tier.id}`,
      wedgeClipId: `wedge-clip-${tier.id}`,
    })
    bottomY = topY
  })

  const bottomTier = geometries[0]
  const topTier = geometries[geometries.length - 1]
  const plateRx = maxRx * 1.14 + 6
  const plate: PlateGeometry = {
    cx: 0,
    cy: (bottomTier?.ry ?? 0) * 0.4,
    rx: plateRx,
    ry: plateRx * 0.16,
  }
  const groundY = plate.cy + plate.ry * 0.45

  const topRx = topTier?.rx ?? 0
  const topRy = topTier?.ry ?? 0
  const topCenterY = topTier?.topY ?? 0
  const minY = topCenterY - topRy - options.topElevation * topRx
  const maxY = plate.cy + plate.ry

  const extraSide = options.hasBox ? 150 : options.hasSideAddOns ? 95 : 0
  const halfWidth = Math.max(plate.rx, maxRx) + extraSide
  const minX = -halfWidth
  const maxX = halfWidth

  const width = maxX - minX + VIEW_PAD * 2
  const height = maxY - minY + VIEW_PAD + VIEW_PAD_BOTTOM
  const viewBox = `${f(minX - VIEW_PAD)} ${f(minY - VIEW_PAD)} ${f(width)} ${f(height)}`

  return {
    tiers: geometries,
    plate,
    groundY,
    viewBox,
    maxRx,
    topRx,
    topRy,
    topCenterY,
  }
}

/**
 * Points along the front rim (lower half) of an ellipse, left → right.
 * `cx` is the horizontal centre — tier-space assets use 0 (the cake axis),
 * authored 0..100 assets pass 50.
 */
export function frontRimPoints(
  rx: number,
  ry: number,
  cy: number,
  count: number,
  inset = 1,
  cx = 0,
): Point[] {
  const points: Point[] = []
  for (let i = 0; i < count; i++) {
    const t = Math.PI - (i / (count - 1)) * Math.PI // π (left) → 0 (right)
    points.push({ x: cx + rx * inset * Math.cos(t), y: cy + ry * inset * Math.sin(t) })
  }
  return points
}

/** Consecutive rim-point pairs — handy for scallops, drips and borders. */
export function rimSegments(
  rx: number,
  ry: number,
  cy: number,
  count: number,
  inset = 1,
  cx = 0,
): Array<{ a: Point; b: Point }> {
  const points = frontRimPoints(rx, ry, cy, count, inset, cx)
  const segments: Array<{ a: Point; b: Point }> = []
  for (let i = 0; i + 1 < points.length; i++) {
    const a = points[i]
    const b = points[i + 1]
    if (a && b) segments.push({ a, b })
  }
  return segments
}
