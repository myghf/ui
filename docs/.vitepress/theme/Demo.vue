<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Preview background: solid surface, muted surface, or a grid. */
    background?: 'surface' | 'muted' | 'grid'
  }>(),
  { background: 'surface' },
)
</script>

<template>
  <div class="myghf-demo" :class="`myghf-demo--${background}`">
    <slot />
  </div>
</template>
