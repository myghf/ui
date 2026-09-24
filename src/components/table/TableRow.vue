<script setup lang="ts">
const props = withDefaults(defineProps<{ clickable?: boolean }>(), { clickable: false })
</script>

<template>
  <tr
    :class="[
      'border-b border-border/60 last:border-b-0',
      clickable && 'cursor-pointer transition-colors hover:bg-surface-muted/50',
    ]"
  >
    <slot />
  </tr>
</template>
