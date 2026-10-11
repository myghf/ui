<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Activity' })
</script>

<template>
  <ol :aria-label="label" class="grid gap-4">
    <slot />
  </ol>
</template>
