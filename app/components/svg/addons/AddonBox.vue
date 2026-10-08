<script setup lang="ts">
/** addon-box — a windowed gift box with the cake peeking through. */
</script>

<template>
  <g id="addon-box">
    <title>Gift box</title>
    <ellipse cx="50" cy="96" rx="38" ry="5.6" fill="#000000" opacity="0.1" />
    <rect x="16" y="46" width="68" height="46" rx="6" fill="#e9c9a4" stroke="#c9a173" stroke-width="1.2" />
    <rect x="12" y="34" width="76" height="17" rx="5" fill="#d9b48c" stroke="#b98f63" stroke-width="1.2" />
    <rect x="32" y="58" width="36" height="26" rx="5" fill="#d7efe4" stroke="#9fcdb9" stroke-width="1.2" />
    <g opacity="0.9">
      <rect x="40" y="76" width="20" height="6" rx="3" fill="#f4b8c6" stroke="#dd94a8" stroke-width="0.7" />
      <rect x="43" y="70" width="14" height="6" rx="3" fill="#fff7ea" stroke="#e3d3b8" stroke-width="0.7" />
      <circle cx="50" cy="66.5" r="2.4" fill="#e2547a" />
    </g>
    <rect x="45" y="34" width="10" height="58" fill="#e2547a" />
    <ellipse cx="38" cy="31" rx="10" ry="5.6" fill="#e2547a" stroke="#c03d63" stroke-width="0.8" transform="rotate(-16 38 31)" />
    <ellipse cx="62" cy="31" rx="10" ry="5.6" fill="#e2547a" stroke="#c03d63" stroke-width="0.8" transform="rotate(16 62 31)" />
    <circle cx="50" cy="32" r="5" fill="#c03d63" />
    <circle cx="50" cy="32" r="2" fill="#fff0f4" />
  </g>
</template>
