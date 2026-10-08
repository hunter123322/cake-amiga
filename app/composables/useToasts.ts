export interface Toast {
  id: number
  text: string
  tone: 'info' | 'warn'
}

const toasts = ref<Toast[]>([])
let seq = 0

export function useToasts() {
  function pushToast(text: string, tone: Toast['tone'] = 'info') {
    const id = ++seq
    toasts.value.push({ id, text, tone })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 3600)
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, pushToast, dismiss }
}
