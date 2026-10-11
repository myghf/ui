<script setup lang="ts">
import { cn } from '../../lib/cn'
import {
  ALIGN_CLASSES,
  GAP_CLASSES,
  JUSTIFY_CLASSES,
  type LayoutAlign,
  type LayoutGap,
  type LayoutJustify,
} from '../../lib/layout'

withDefaults(
  defineProps<{
    /** Element to render. */
    as?: string
    /** Space between children. */
    gap?: LayoutGap
    /** Cross-axis alignment. */
    align?: LayoutAlign
    /** Main-axis justification. */
    justify?: LayoutJustify
  }>(),
  { as: 'div', gap: 'md' },
)
</script>

<template>
  <component
    :is="as"
    :class="cn('flex flex-col', GAP_CLASSES[gap], align ? ALIGN_CLASSES[align] : '', justify ? JUSTIFY_CLASSES[justify] : '')"
  >
    <slot />
  </component>
</template>
