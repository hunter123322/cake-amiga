import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app/app.vue',
    './app/components/**/*.vue',
    './app/composables/**/*.ts',
    './app/pages/**/*.vue',
    './app/stores/**/*.ts',
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '75%': { transform: 'translateX(3px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.72', transform: 'scale(0.9)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        'panel-in': {
          '0%': { transform: 'translateY(10px)' },
          '100%': { transform: 'none' },
        },
        'confetti-fly': {
          '0%': { transform: 'translate3d(0, 0, 0) rotate(0deg)', opacity: '1' },
          '100%': {
            transform: 'translate3d(var(--tx, 0px), var(--ty, -200px), 0) rotate(var(--rot, 180deg))',
            opacity: '0',
          },
        },
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out',
        flicker: 'flicker 1.1s ease-in-out infinite',
        'pop-in': 'pop-in 0.25s ease-out both',
        'panel-in': 'panel-in 0.22s ease-out both',
        'confetti-fly': 'confetti-fly 1.4s cubic-bezier(0.16, 0.8, 0.4, 1) forwards',
      },
    },
  },
}
