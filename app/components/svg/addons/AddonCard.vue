<script setup lang="ts">
/** addon-card — a handwritten gift card. */
</script>

<template>
  <g id="addon-card">
    <title>Gift card</title>
    <ellipse cx="50" cy="95" rx="30" ry="4.6" fill="#000000" opacity="0.1" />
    <rect x="20" y="32" width="60" height="44" rx="7" fill="#fffdf7" stroke="#e3d8c2" stroke-width="1.3" />
    <rect x="44.5" y="32" width="11" height="44" fill="#e2547a" />
    <line x1="28" y1="52" x2="40" y2="52" stroke="#cbbfa6" stroke-width="1.6" stroke-linecap="round" />
    <line x1="28" y1="58" x2="36" y2="58" stroke="#d8cdb6" stroke-width="1.6" stroke-linecap="round" />
    <line x1="62" y1="52" x2="72" y2="52" stroke="#cbbfa6" stroke-width="1.6" stroke-linecap="round" />
    <line x1="64" y1="58" x2="72" y2="58" stroke="#d8cdb6" stroke-width="1.6" stroke-linecap="round" />
    <path
      d="M 50 66 c -1.8 -3 -6.4 -2.6 -6.4 1 c 0 2.8 3.6 5 6.4 7.2 c 2.8 -2.2 6.4 -4.4 6.4 -7.2 c 0 -3.6 -4.6 -4 -6.4 -1 Z"
      fill="#e2547a"
    />
    <ellipse cx="41" cy="30" rx="8" ry="5" fill="#e2547a" stroke="#c03d63" stroke-width="0.8" transform="rotate(-18 41 30)" />
    <ellipse cx="59" cy="30" rx="8" ry="5" fill="#e2547a" stroke="#c03d63" stroke-width="0.8" transform="rotate(18 59 30)" />
    <circle cx="50" cy="31" r="4.4" fill="#c03d63" />
  </g>
</template>
