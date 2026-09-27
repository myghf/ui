<script setup lang="ts">
import { Tag } from '@myghf/ui'

const tones = ['info', 'success', 'warning', 'danger', 'secondary'] as const
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Tag v-for="tone in tones" :key="tone" :tone="tone">{{ tone }}</Tag>
  </div>
</template>
