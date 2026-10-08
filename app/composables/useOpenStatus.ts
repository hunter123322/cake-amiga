import { SHOP_INFO } from '~/data/shop/info'
import type { ShopHoursPeriod } from '~/types/shop'

function toMinutes(time: string): number {
  const [hours = '0', minutes = '0'] = time.split(':')
  return Number(hours) * 60 + Number(minutes)
}

function toLabel(time: string): string {
  const [hours = '0', minutes = '0'] = time.split(':')
  const hour = Number(hours)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const display = hour % 12 === 0 ? 12 : hour % 12
  return minutes === '00' ? `${display} ${suffix}` : `${display}:${minutes} ${suffix}`
}

/**
 * “Open now” badge for the landing hero. The clock only exists on the client, so
 * the server renders the neutral state and the badge fills in after mount — no
 * hydration mismatch, and the status is honest for the visitor's own clock.
 */
export function useOpenStatus() {
  const now = ref<Date | null>(null)
  let ticker: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    now.value = new Date()
    ticker = setInterval(() => {
      now.value = new Date()
    }, 60_000)
  })

  onBeforeUnmount(() => clearInterval(ticker))

  const period = computed<ShopHoursPeriod | undefined>(() =>
    now.value ? SHOP_INFO.periods.find((entry) => entry.days.includes(now.value!.getDay())) : undefined,
  )

  const ready = computed(() => now.value !== null)

  const isOpen = computed(() => {
    if (!now.value || !period.value) return false
    const minutes = now.value.getHours() * 60 + now.value.getMinutes()
    return minutes >= toMinutes(period.value.open) && minutes < toMinutes(period.value.close)
  })

  const label = computed(() => {
    if (!period.value) return 'Closed today'
    const window = `${toLabel(period.value.open)} – ${toLabel(period.value.close)}`
    return isOpen.value ? `Open now · until ${toLabel(period.value.close)}` : `Closed now · opens ${window}`
  })

  return { ready, isOpen, label }
}
