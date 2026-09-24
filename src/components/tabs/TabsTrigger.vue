<script setup lang="ts">
import { TabsTrigger as RekaTabsTrigger } from 'reka-ui'

defineProps<{ value: string; disabled?: boolean }>()
</script>

<template>
  <RekaTabsTrigger
    :value="value"
    :disabled="disabled"
    class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[disabled]:opacity-50"
  >
    <slot />
  </RekaTabsTrigger>
</template>
