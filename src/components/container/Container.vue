<script setup lang="ts">
import { cn } from '../../lib/cn'

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full'

withDefaults(
  defineProps<{
    /** Element to render. */
    as?: string
    /** Max width. */
    size?: Size
    /** Add responsive horizontal padding. */
    padded?: boolean
  }>(),
  { as: 'div', size: 'lg', padded: true },
)

const SIZES: Record<Size, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-2xl',
  full: 'max-w-none',
}
</script>

<template>
  <component :is="as" :class="cn('mx-auto w-full', SIZES[size], padded ? 'px-4 sm:px-6' : '')">
    <slot />
  </component>
</template>
