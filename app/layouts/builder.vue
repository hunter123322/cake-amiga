<template>
  <!-- The builder owns the whole viewport: no header, no footer, no page scroll. -->
  <div class="h-[100dvh] overflow-hidden bg-[#fffbeb] text-slate-900">
    <slot />
  </div>
</template>
