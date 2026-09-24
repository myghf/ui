<script setup lang="ts">
import { TabsContent as RekaTabsContent } from 'reka-ui'

const props = withDefaults(defineProps<{ value: string; padding?: boolean }>(), { padding: true })
</script>

<template>
  <RekaTabsContent :value="value" :class="['focus-visible:outline-none', padding ? 'pt-4' : '']">
    <slot />
  </RekaTabsContent>
</template>
