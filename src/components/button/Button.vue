<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 data-[loading=true]:cursor-not-allowed',
  variants: {
    variant: {
      default: 'bg-primary-500 text-white hover:bg-primary-600',
      secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
      destructive: 'bg-error-500 text-white hover:bg-error-600',
      outline: 'border border-border bg-surface text-foreground hover:bg-surface-muted',
      ghost: 'text-foreground hover:bg-surface-muted',
    },
    size: {
      sm: 'h-8 px-3 text-xs',
      default: 'h-9 px-4',
      lg: 'h-10 px-6',
      icon: 'size-9',
      'icon-sm': 'size-8',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})

const props = withDefaults(
  defineProps<{
    variant?: VariantProps<typeof buttonVariants>['variant']
    size?: VariantProps<typeof buttonVariants>['size']
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    /** Text label; equivalent to slot content. PrimeVue parity for the app migration. */
    label?: string
  }>(),
  { variant: 'default', size: 'default', type: 'button', disabled: false, loading: false },
)

const attrs = useAttrs()
const isDisabled = computed(() => props.disabled || props.loading || Boolean(attrs.disabled))
</script>

<template>
  <button
    :type="type"
    :disabled="isDisabled"
    :data-loading="loading || undefined"
    :class="buttonVariants({ variant, size })"
    v-bind="attrs"
  >
    <span v-if="loading" class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
    <slot v-else>{{ label }}</slot>
  </button>
</template>
