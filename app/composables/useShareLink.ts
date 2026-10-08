/** Copy a share link that encodes the current cake config. */
export function useShareLink() {
  const store = useCakeStore()
  const route = useRoute()
  const router = useRouter()
  const { pushToast } = useToasts()

  async function copyShareLink() {
    if (import.meta.server) return
    const href = router.resolve({ path: route.path, query: { c: store.toURL() } }).href
    const url = `${window.location.origin}${href}`
    try {
      await navigator.clipboard.writeText(url)
      pushToast('Share link copied to clipboard')
    } catch {
      pushToast('Could not copy the link — select it from the address bar', 'warn')
    }
  }

  return { copyShareLink }
}
