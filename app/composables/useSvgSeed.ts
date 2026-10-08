/** Small string hash (xmur3) — deterministic across server and client. */
export function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}

/** Fast seeded PRNG (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Deterministic random generator for a given seed (string or number). */
export function seededRandom(seed: string | number): () => number {
  const hash = xmur3(String(seed))
  return mulberry32(hash())
}

/** Deterministic value in [min, max). */
export function seededRange(rand: () => number, min: number, max: number): number {
  return min + rand() * (max - min)
}

/** Deterministic pick from a list (the list must not be empty). */
export function seededPick<T>(rand: () => number, list: readonly T[]): T {
  const item = list[Math.floor(rand() * list.length) % list.length]
  if (item === undefined) throw new Error('seededPick needs a non-empty list')
  return item
}
