<script setup lang="ts">
import { ref } from 'vue'
import { Tag } from '@myghf/ui'

const tags = ref([
  { label: 'Cardiology', icon: 'heart' },
  { label: 'Analytics', icon: 'chart-line' },
  { label: 'Appointments', icon: 'calendar' },
])

function remove(label: string) {
  tags.value = tags.value.filter((tag) => tag.label !== label)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Tag
      v-for="tag in tags"
      :key="tag.label"
      :icon="tag.icon"
      removable
      :remove-label="`Remove ${tag.label}`"
      @remove="remove(tag.label)"
    >
      {{ tag.label }}
    </Tag>
    <span v-if="tags.length === 0" class="text-sm text-muted">All tags removed.</span>
  </div>
</template>
