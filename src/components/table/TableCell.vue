<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/cn'

const props = withDefaults(
  defineProps<{ align?: 'start' | 'center' | 'end'; truncate?: boolean }>(),
  { align: 'start' },
)

const classes = computed(() =>
  cn(
    'px-3 py-2 align-middle',
    props.align === 'center' && 'text-center',
    props.align === 'end' && 'text-end',
    props.truncate && 'max-w-0 truncate',
  ),
)
</script>

<template>
  <td :class="classes">
    <slot />
  </td>
</template>
