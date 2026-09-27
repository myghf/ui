<script setup lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'

defineOptions({ inheritAttrs: false })

const skeleton = tv({
  base: 'animate-pulse bg-surface-muted',
  variants: {
    rounded: {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: { rounded: 'md' },
})

withDefaults(
  defineProps<{
    rounded?: VariantProps<typeof skeleton>['rounded']
    width?: string
    height?: string
  }>(),
  { rounded: 'md' },
)
</script>

<template>
  <div :class="skeleton({ rounded })" :style="{ width, height }" v-bind="$attrs">
    <slot />
  </div>
</template>
