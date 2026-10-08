<script setup lang="ts">
/** addon-candles — a bundled pack of party candles. */
</script>

<template>
  <g id="addon-candles">
    <title>Loose candle pack</title>
    <ellipse cx="50" cy="95" rx="33" ry="5" fill="#000000" opacity="0.1" />
    <g>
      <rect x="20" y="50" width="10" height="44" rx="4" fill="#f4a0b8" stroke="#d97a97" stroke-width="1" />
      <rect x="45" y="42" width="10" height="52" rx="4" fill="#8fbfe8" stroke="#6a9dc9" stroke-width="1" />
      <rect x="70" y="54" width="10" height="40" rx="4" fill="#f5da6d" stroke="#d3b64a" stroke-width="1" />
      <line x1="25" y1="56" x2="25" y2="90" stroke="#ffffff" stroke-width="1.4" opacity="0.65" />
      <line x1="50" y1="48" x2="50" y2="90" stroke="#ffffff" stroke-width="1.4" opacity="0.65" />
      <line x1="75" y1="60" x2="75" y2="90" stroke="#ffffff" stroke-width="1.4" opacity="0.65" />
      <line x1="25" y1="42" x2="25" y2="50" stroke="#6b4a2f" stroke-width="1.4" />
      <line x1="50" y1="34" x2="50" y2="42" stroke="#6b4a2f" stroke-width="1.4" />
      <line x1="75" y1="46" x2="75" y2="54" stroke="#6b4a2f" stroke-width="1.4" />
      <ellipse cx="25" cy="38" rx="3.2" ry="5" fill="url(#flame-grad)" class="animate-flicker" style="transform-box: fill-box; transform-origin: 50% 100%" />
      <ellipse cx="50" cy="30" rx="3.2" ry="5" fill="url(#flame-grad)" class="animate-flicker" style="transform-box: fill-box; transform-origin: 50% 100%" />
      <ellipse cx="75" cy="42" rx="3.2" ry="5" fill="url(#flame-grad)" class="animate-flicker" style="transform-box: fill-box; transform-origin: 50% 100%" />
    </g>
    <rect x="14" y="76" width="72" height="9" rx="4.5" fill="#e2547a" stroke="#c03d63" stroke-width="0.8" />
    <circle cx="50" cy="76" r="5.5" fill="#e2547a" stroke="#c03d63" stroke-width="0.8" />
    <circle cx="50" cy="76" r="2" fill="#fff0f4" />
  </g>
</template>
