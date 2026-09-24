<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/cn'

const props = withDefaults(
  defineProps<{ striped?: boolean; size?: 'sm' | 'default'; contained?: boolean }>(),
  { size: 'default', contained: true },
)

const classes = computed(() =>
  cn(
    'w-full border-collapse text-start text-sm text-foreground',
    props.size === 'sm' ? 'text-xs' : 'text-sm',
    props.striped && '[&_tbody>tr:nth-child(even)]:bg-surface-muted/40',
    props.contained && 'overflow-hidden rounded-md border border-border bg-surface',
  ),
)
</script>

<template>
  <table :class="classes">
    <slot />
  </table>
</template>
