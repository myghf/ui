<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/cn'
import { COLS_CLASSES, GAP_CLASSES, type LayoutCols, type LayoutGap } from '../../lib/layout'

const props = withDefaults(
  defineProps<{
    /** Element to render. */
    as?: string
    /** Space between tracks. */
    gap?: LayoutGap
    /** Fixed number of columns. */
    cols?: LayoutCols
    /** Responsive auto-fit columns at this minimum track width, e.g. `'16rem'`. */
    minItemWidth?: string
  }>(),
  { as: 'div', gap: 'md', cols: 1 },
)

const style = computed(() =>
  props.minItemWidth
    ? { gridTemplateColumns: `repeat(auto-fit, minmax(${props.minItemWidth}, 1fr))` }
    : undefined,
)
</script>

<template>
  <component :is="as" :class="cn('grid', GAP_CLASSES[gap], minItemWidth ? '' : COLS_CLASSES[cols])" :style="style">
    <slot />
  </component>
</template>
