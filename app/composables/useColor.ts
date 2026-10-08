export interface RGB {
  r: number
  g: number
  b: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const num = Number.parseInt(h, 16)
  if (h.length !== 6 || Number.isNaN(num)) return { r: 255, g: 255, b: 255 }
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

export function rgbToHex({ r, g, b }: RGB): string {
  const to = (v: number) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

function rgbToHsl({ r, g, b }: RGB): { h: number; s: number; l: number } {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0)
  else if (max === gn) h = (bn - rn) / d + 2
  else h = (rn - gn) / d + 4
  return { h: h / 6, s, l }
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): RGB {
  if (s === 0) {
    const v = l * 255
    return { r: v, g: v, b: v }
  }
  const hue = (p: number, q: number, t: number) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return {
    r: hue(p, q, h + 1 / 3) * 255,
    g: hue(p, q, h) * 255,
    b: hue(p, q, h - 1 / 3) * 255,
  }
}

/** Increase lightness by `pct` (0-100) of the HSL lightness scale. */
export function lighten(hex: string, pct: number): string {
  const hsl = rgbToHsl(hexToRgb(hex))
  hsl.l = clamp(hsl.l + pct / 100, 0, 1)
  return rgbToHex(hslToRgb(hsl))
}

/** Decrease lightness by `pct` (0-100). */
export function darken(hex: string, pct: number): string {
  const hsl = rgbToHsl(hexToRgb(hex))
  hsl.l = clamp(hsl.l - pct / 100, 0, 1)
  return rgbToHex(hslToRgb(hsl))
}

/** Mix two hex colors; weight 1 returns `a`, 0 returns `b`. */
export function mix(a: string, b: string, weight = 0.5): string {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  const w = clamp(weight, 0, 1)
  return rgbToHex({
    r: ca.r * w + cb.r * (1 - w),
    g: ca.g * w + cb.g * (1 - w),
    b: ca.b * w + cb.b * (1 - w),
  })
}

/** Relative luminance based pick between dark and light text. */
export function contrastText(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return lum > 0.62 ? '#3f3f46' : '#ffffff'
}

/** True when the color is (near) white — useful for choosing shading strategy. */
export function isVeryLight(hex: string): boolean {
  return rgbToHsl(hexToRgb(hex)).l > 0.93
}
