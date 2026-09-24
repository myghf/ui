<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/cn'

const props = withDefaults(
  defineProps<{
    sortDirection?: 'ascending' | 'descending' | 'none'
    width?: string
    align?: 'start' | 'center' | 'end'
  }>(),
  { align: 'start' },
)

const ariaSort = computed(() =>
  props.sortDirection && props.sortDirection !== 'none' ? props.sortDirection : undefined,
)
</script>

<template>
  <th
    scope="col"
    :aria-sort="ariaSort"
    :style="width ? { width } : undefined"
    :class="cn(
      'px-3 py-2 font-medium',
      align === 'center' && 'text-center',
      align === 'end' && 'text-end',
    )"
  >
    <slot />
  </th>
</template>
