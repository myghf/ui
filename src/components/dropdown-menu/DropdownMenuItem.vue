<script setup lang="ts">
import { DropdownMenuItem as RekaItem } from 'reka-ui'
import { tv, type VariantProps } from 'tailwind-variants'

const itemVariants = tv({
  base: 'relative flex w-full cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none transition-colors focus:bg-surface-muted data-[highlighted]:bg-surface-muted data-[highlighted]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  variants: {
    variant: {
      default: 'text-foreground',
      destructive: 'text-error-600',
    },
  },
  defaultVariants: { variant: 'default' },
})

defineProps<{ variant?: VariantProps<typeof itemVariants>['variant'] }>()
const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <RekaItem :class="itemVariants({ variant })" @select="emit('select')">
    <slot />
  </RekaItem>
</template>
