<script setup lang="ts">
import { TabsList as RekaTabsList } from 'reka-ui'
</script>

<template>
  <RekaTabsList class="inline-flex h-9 w-full items-center justify-start gap-1 rounded-lg bg-surface-muted p-1 text-muted">
    <slot />
  </RekaTabsList>
</template>
