<script setup lang="ts">
defineProps<{
  /** The id of the element the description describes. */
  id?: string
}>()
</script>

<template>
  <p v-if="$slots.default" :id="id" class="text-sm text-muted">
    <slot />
  </p>
</template>
