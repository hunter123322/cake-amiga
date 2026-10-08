const soundEnabled = ref(false)
let audioCtx: AudioContext | null = null

/** Optional soft chime on selection — muted by default, no audio files. */
export function useSound() {
  function playTap(freq = 660) {
    if (!soundEnabled.value || import.meta.server) return
    try {
      audioCtx = audioCtx ?? new AudioContext()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const now = audioCtx.currentTime
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(now)
      osc.stop(now + 0.15)
    } catch {
      // audio is a nice-to-have; never let it break the builder
    }
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
    if (soundEnabled.value) playTap(880)
  }

  return { soundEnabled, toggleSound, playTap }
}
