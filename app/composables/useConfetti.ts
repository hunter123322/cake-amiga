const burstKey = ref(0)

/** Global trigger for the confetti / sparkle burst on add-to-cart. */
export function useConfetti() {
  function fire() {
    burstKey.value++
  }
  return { burstKey, fire }
}
