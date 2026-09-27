<script setup lang="ts">
defineProps<{
  /** The id of the element the message describes. */
  id?: string
}>()
</script>

<template>
  <p v-if="$slots.default" :id="id" role="alert" class="text-sm text-error-600">
    <slot />
  </p>
</template>
