<template>
  <defs>
    <linearGradient id="body-shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="58%" stop-color="#000000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.16" />
    </linearGradient>
    <linearGradient id="body-shine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.32" />
      <stop offset="38%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <radialGradient id="flame-grad">
      <stop offset="0%" stop-color="#fff8d6" />
      <stop offset="55%" stop-color="#ffd166" />
      <stop offset="100%" stop-color="#f97316" />
    </radialGradient>
    <radialGradient id="plate-shine">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="80%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </radialGradient>
    <filter id="soft-shadow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
      <feOffset dx="0" dy="3" result="blur" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.22" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
</template>
