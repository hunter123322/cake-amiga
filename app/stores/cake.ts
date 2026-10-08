import type {
  AddOnId,
  CakeConfig,
  CartPayload,
  Coating,
  CoatingFinishId,
  SideDesign,
  SideDesignId,
  Tier,
  TopDesign,
  TopDesignId,
} from '~/types/cake'
import type { CakePreset, PresetTier } from '~/data/presets'
import { FLAVORS } from '~/data/flavors'
import { COATING_COLORS, COATING_FINISHES } from '~/data/coatings'
import { SIDE_COLORS, SIDE_DESIGNS } from '~/data/sideDesigns'
import { TOP_COLORS, TOP_DESIGNS, getTopDesign } from '~/data/topDesigns'
import { ADD_ONS } from '~/data/addOns'
import { DEFAULT_PRESET_ID, getPreset } from '~/data/presets'

export const STEPS = [
  { id: 'size', label: 'Size', icon: 'ruler' },
  { id: 'flavor', label: 'Flavor', icon: 'swirl' },
  { id: 'coating', label: 'Coating', icon: 'palette' },
  { id: 'side', label: 'Side', icon: 'pattern' },
  { id: 'top', label: 'Topper', icon: 'star' },
  { id: 'extras', label: 'Extras', icon: 'gift' },
  { id: 'review', label: 'Review', icon: 'check' },
] as const

export type StepId = (typeof STEPS)[number]['id']

interface Snapshot {
  tiers: Tier[]
  coating: Coating
  sideDesign: SideDesign
  topDesign: TopDesign
  addOns: AddOnId[]
  rush: boolean
}

const HISTORY_DEBOUNCE = 320
const HISTORY_LIMIT = 60

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

/** Random element of a non-empty constant list (they are all non-empty here). */
const pickRandom = <T>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)] as T

const DEFAULT_FLAVOR_ID = FLAVORS[0]?.id ?? 'vanilla'

let tierSeq = 0
const nextTierId = () => `tier-${++tierSeq}`

export const useCakeStore = defineStore('cake', () => {
  const tiers = ref<Tier[]>([])
  const coating = ref<Coating>({ finish: 'coating-smooth', color: '#f8f0dd' })
  const sideDesign = ref<SideDesign>({ id: 'side-none', color: '#ffffff', message: '' })
  const topDesign = ref<TopDesign>({ id: 'top-none', color: '#ffffff', candleCount: 5, number: '1' })
  const addOns = ref<AddOnId[]>([])
  const rush = ref(false)

  const currentStepIndex = ref(0)
  const selectedTierId = ref('')
  const view = ref<'whole' | 'slice'>('whole')
  const cart = ref<CartPayload[]>([])

  let applying = false
  let historyTimer: ReturnType<typeof setTimeout> | null = null

  const config = computed<CakeConfig>(() => ({
    tiers: tiers.value,
    coating: coating.value,
    sideDesign: sideDesign.value,
    topDesign: topDesign.value,
    addOns: addOns.value,
    rush: rush.value,
  }))

  const pricing = computed(() => computePricing(config.value))
  const validation = computed(() => validateCake(config.value))

  const tierCount = computed(() => tiers.value.length)
  const totalPrice = computed(() => pricing.value.total)
  const totalHeightIn = computed(() => tiers.value.reduce((sum, t) => sum + t.heightIn, 0))
  const servings = computed(() => pricing.value.servings)
  const weightKg = computed(() => pricing.value.weightKg)
  const leadTimeDays = computed(() => pricing.value.leadTimeDays)
  const canAddTier = computed(() => tiers.value.length < TIER_LIMITS.countMax)
  const canRemoveTier = computed(() => tiers.value.length > TIER_LIMITS.countMin)
  const currentStep = computed(() => STEPS[currentStepIndex.value] ?? STEPS[0])
  const topDesignDef = computed(() => getTopDesign(topDesign.value.id))
  const selectedTier = computed(
    () =>
      tiers.value.find((t) => t.id === selectedTierId.value) ??
      tiers.value[tiers.value.length - 1] ??
      null,
  )

  // ---------------------------------------------------------------------------
  // History (undo / redo) — snapshots are coalesced with a debounce so a slider
  // drag becomes a single undo step.
  // ---------------------------------------------------------------------------
  const past = ref<Snapshot[]>([])
  const future = ref<Snapshot[]>([])
  const canUndo = computed(() => past.value.length > 1)
  const canRedo = computed(() => future.value.length > 0)

  function snapshot(): Snapshot {
    return clone({
      tiers: tiers.value,
      coating: coating.value,
      sideDesign: sideDesign.value,
      topDesign: topDesign.value,
      addOns: addOns.value,
      rush: rush.value,
    })
  }

  function applySnapshot(s: Snapshot) {
    applying = true
    tiers.value = clone(s.tiers)
    coating.value = clone(s.coating)
    sideDesign.value = clone(s.sideDesign)
    topDesign.value = clone(s.topDesign)
    addOns.value = clone(s.addOns)
    rush.value = s.rush
    if (!tiers.value.some((t) => t.id === selectedTierId.value)) {
      selectedTierId.value = tiers.value[tiers.value.length - 1]?.id ?? ''
    }
    setTimeout(() => {
      applying = false
    }, HISTORY_DEBOUNCE + 150)
  }

  function commitHistory() {
    if (applying) return
    const next = snapshot()
    const last = past.value[past.value.length - 1]
    if (last && JSON.stringify(last) === JSON.stringify(next)) return
    past.value.push(next)
    if (past.value.length > HISTORY_LIMIT) past.value.shift()
    future.value = []
  }

  function scheduleHistory() {
    if (applying) return
    if (historyTimer) clearTimeout(historyTimer)
    historyTimer = setTimeout(commitHistory, HISTORY_DEBOUNCE)
  }

  function undo() {
    if (past.value.length <= 1) return
    const current = past.value.pop()
    if (current) future.value.push(current)
    const target = past.value[past.value.length - 1]
    if (target) applySnapshot(target)
  }

  function redo() {
    const next = future.value.pop()
    if (!next) return
    past.value.push(next)
    applySnapshot(next)
  }

  function resetHistory() {
    past.value = [snapshot()]
    future.value = []
  }

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------
  function enforceStacking(startIndex = 1) {
    for (let i = Math.max(1, startIndex); i < tiers.value.length; i++) {
      const tier = tiers.value[i]
      const below = tiers.value[i - 1]
      if (!tier || !below) continue
      if (tier.diameterIn > below.diameterIn) {
        tiers.value[i] = { ...tier, diameterIn: below.diameterIn }
      }
    }
  }

  function selectTier(id: string) {
    selectedTierId.value = id
  }

  function addTier() {
    if (!canAddTier.value) return
    const top = tiers.value[tiers.value.length - 1]
    const newTier: Tier = {
      id: nextTierId(),
      diameterIn: clampDiameter((top?.diameterIn ?? 10) - 2),
      heightIn: 4,
      flavorId: top?.flavorId ?? DEFAULT_FLAVOR_ID,
    }
    tiers.value.push(newTier)
    selectedTierId.value = newTier.id
  }

  function removeTier() {
    if (!canRemoveTier.value) return
    tiers.value.pop()
    selectedTierId.value = tiers.value[tiers.value.length - 1]?.id ?? ''
  }

  function updateTier(
    id: string,
    patch: Partial<Pick<Tier, 'heightIn' | 'diameterIn' | 'flavorId'>>,
  ) {
    const index = tiers.value.findIndex((t) => t.id === id)
    const current = tiers.value[index]
    if (index === -1 || !current) return
    const next: Tier = { ...current }
    if (patch.heightIn !== undefined) next.heightIn = clampHeight(patch.heightIn)
    if (patch.diameterIn !== undefined) next.diameterIn = clampDiameter(patch.diameterIn)
    if (patch.flavorId !== undefined) next.flavorId = patch.flavorId
    tiers.value[index] = next
    // Upper tiers may never be wider than the tier below.
    enforceStacking(index + 1)
  }

  function setFlavor(tierId: string, flavorId: string) {
    updateTier(tierId, { flavorId })
  }

  function setCoatingFinish(finish: CoatingFinishId) {
    coating.value = { ...coating.value, finish }
  }

  function setCoatingColor(color: string) {
    coating.value = { ...coating.value, color }
  }

  function setSideDesign(id: SideDesignId) {
    sideDesign.value = { ...sideDesign.value, id }
  }

  function setSideColor(color: string) {
    sideDesign.value = { ...sideDesign.value, color }
  }

  function setMessage(message: string) {
    sideDesign.value = { ...sideDesign.value, message: sanitizeMessage(message) }
  }

  function setTopDesign(id: TopDesignId) {
    topDesign.value = { ...topDesign.value, id }
  }

  function setTopColor(color: string) {
    topDesign.value = { ...topDesign.value, color }
  }

  function setCandleCount(count: number) {
    topDesign.value = {
      ...topDesign.value,
      candleCount: Math.round(Math.min(7, Math.max(1, count))),
    }
  }

  function setTopNumber(value: string) {
    topDesign.value = { ...topDesign.value, number: value.replace(/\D/g, '').slice(0, 2) }
  }

  function toggleAddOn(id: AddOnId) {
    addOns.value = addOns.value.includes(id)
      ? addOns.value.filter((a) => a !== id)
      : [...addOns.value, id]
  }

  function setRush(value: boolean) {
    rush.value = value
  }

  function setView(value: 'whole' | 'slice') {
    view.value = value
  }

  function setStep(index: number) {
    currentStepIndex.value = Math.min(STEPS.length - 1, Math.max(0, index))
  }

  function nextStep() {
    setStep(currentStepIndex.value + 1)
  }

  function prevStep() {
    setStep(currentStepIndex.value - 1)
  }

  // ---------------------------------------------------------------------------
  // Presets, randomize, reset
  // ---------------------------------------------------------------------------
  function applyPreset(presetOrId: string | CakePreset) {
    const preset = typeof presetOrId === 'string' ? getPreset(presetOrId) : presetOrId
    tiers.value = preset.tiers.map((t: PresetTier) => ({
      id: nextTierId(),
      diameterIn: clampDiameter(t.diameterIn),
      heightIn: clampHeight(t.heightIn),
      flavorId: FLAVORS.some((f) => f.id === t.flavorId) ? t.flavorId : DEFAULT_FLAVOR_ID,
    }))
    enforceStacking()
    coating.value = { ...preset.coating }
    sideDesign.value = { ...preset.sideDesign, message: sanitizeMessage(preset.sideDesign.message) }
    topDesign.value = { ...preset.topDesign }
    addOns.value = [...preset.addOns]
    rush.value = false
    selectedTierId.value = tiers.value[tiers.value.length - 1]?.id ?? ''
  }

  function randomize() {
    const count = 1 + Math.floor(Math.random() * 3)
    let diameter = 9 + Math.floor(Math.random() * 4) // 9..12
    const nextTiers: Tier[] = []
    for (let i = 0; i < count; i++) {
      nextTiers.push({
        id: nextTierId(),
        diameterIn: clampDiameter(diameter),
        heightIn: 4 + Math.floor(Math.random() * 5), // 4..8
        flavorId: pickRandom(FLAVORS).id,
      })
      diameter -= 1 + Math.floor(Math.random() * 2)
    }
    tiers.value = nextTiers
    enforceStacking()
    coating.value = {
      finish: pickRandom(COATING_FINISHES).id,
      color: pickRandom(COATING_COLORS).hex,
    }
    sideDesign.value = {
      id: pickRandom(SIDE_DESIGNS).id,
      color: pickRandom(SIDE_COLORS).hex,
      message: sideDesign.value.message,
    }
    topDesign.value = {
      id: pickRandom(TOP_DESIGNS).id,
      color: pickRandom(TOP_COLORS).hex,
      candleCount: 1 + Math.floor(Math.random() * 7),
      number: String(1 + Math.floor(Math.random() * 9)),
    }
    const pool = ADD_ONS.map((a) => a.id)
    addOns.value = pool.filter(() => Math.random() < 0.25)
    rush.value = false
    selectedTierId.value = nextTiers[nextTiers.length - 1]?.id ?? ''
  }

  function reset() {
    applyPreset(DEFAULT_PRESET_ID)
  }

  // ---------------------------------------------------------------------------
  // Cart + share
  // ---------------------------------------------------------------------------
  function addToCart(): CartPayload {
    const payload: CartPayload = {
      id: `order-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      config: clone(config.value),
      pricing: clone(pricing.value),
    }
    cart.value.push(payload)
    return payload
  }

  function toURL(): string {
    const json = JSON.stringify(snapshot())
    const bytes = new TextEncoder().encode(json)
    let binary = ''
    bytes.forEach((b) => {
      binary += String.fromCharCode(b)
    })
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }

  /** Restore a shared config. Returns false when the token is invalid. */
  function fromURL(token: string): boolean {
    try {
      const base64 = token.replace(/-/g, '+').replace(/_/g, '/')
      const binary = atob(base64)
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
      const data = JSON.parse(new TextDecoder().decode(bytes)) as Partial<Snapshot>
      if (!data || !Array.isArray(data.tiers) || data.tiers.length === 0) return false
      const restored: Snapshot = {
        tiers: data.tiers.slice(0, TIER_LIMITS.countMax).map((t) => ({
          id: nextTierId(),
          diameterIn: clampDiameter(Number(t?.diameterIn) || 10),
          heightIn: clampHeight(Number(t?.heightIn) || 4),
          flavorId: FLAVORS.some((f) => f.id === t?.flavorId)
            ? (t.flavorId as string)
            : DEFAULT_FLAVOR_ID,
        })),
        coating: {
          finish: COATING_FINISHES.some((f) => f.id === data.coating?.finish)
            ? (data.coating?.finish as CoatingFinishId)
            : 'coating-smooth',
          color: /^#[0-9a-f]{3,6}$/i.test(data.coating?.color ?? '') ? data.coating!.color : '#ffffff',
        },
        sideDesign: {
          id: SIDE_DESIGNS.some((s) => s.id === data.sideDesign?.id)
            ? (data.sideDesign?.id as SideDesignId)
            : 'side-none',
          color: /^#[0-9a-f]{3,6}$/i.test(data.sideDesign?.color ?? '')
            ? data.sideDesign!.color
            : '#ffffff',
          message: sanitizeMessage(String(data.sideDesign?.message ?? '')),
        },
        topDesign: {
          id: TOP_DESIGNS.some((t) => t.id === data.topDesign?.id)
            ? (data.topDesign?.id as TopDesignId)
            : 'top-none',
          color: /^#[0-9a-f]{3,6}$/i.test(data.topDesign?.color ?? '')
            ? data.topDesign!.color
            : '#ffffff',
          candleCount: Math.min(7, Math.max(1, Math.round(Number(data.topDesign?.candleCount) || 5))),
          number: String(data.topDesign?.number ?? '1').replace(/\D/g, '').slice(0, 2) || '1',
        },
        addOns: (Array.isArray(data.addOns) ? data.addOns : []).filter((id): id is AddOnId =>
          ADD_ONS.some((a) => a.id === id),
        ),
        rush: Boolean(data.rush),
      }
      applySnapshot(restored)
      resetHistory()
      return true
    } catch {
      return false
    }
  }

  // ---------------------------------------------------------------------------
  // Boot with the demo signature preset (3 tiers, renders on load)
  // ---------------------------------------------------------------------------
  applyPreset(DEFAULT_PRESET_ID)
  resetHistory()

  watch([tiers, coating, sideDesign, topDesign, addOns, rush], scheduleHistory, { deep: true })

  return {
    // state
    tiers,
    coating,
    sideDesign,
    topDesign,
    addOns,
    rush,
    view,
    currentStepIndex,
    currentStep,
    selectedTierId,
    selectedTier,
    cart,
    // computed
    config,
    pricing,
    validation,
    tierCount,
    totalPrice,
    totalHeightIn,
    servings,
    weightKg,
    leadTimeDays,
    canAddTier,
    canRemoveTier,
    topDesignDef,
    canUndo,
    canRedo,
    // actions
    addTier,
    removeTier,
    updateTier,
    setFlavor,
    setCoatingFinish,
    setCoatingColor,
    setSideDesign,
    setSideColor,
    setMessage,
    setTopDesign,
    setTopColor,
    setCandleCount,
    setTopNumber,
    toggleAddOn,
    setRush,
    setView,
    setStep,
    nextStep,
    prevStep,
    selectTier,
    applyPreset,
    randomize,
    reset,
    undo,
    redo,
    addToCart,
    toURL,
    fromURL,
  }
})
