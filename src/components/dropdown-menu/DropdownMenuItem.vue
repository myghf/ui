<script setup lang="ts">
import { DropdownMenuItem as RekaItem } from 'reka-ui'
import { tv, type VariantProps } from 'tailwind-variants'
import Icon from '../icon/Icon.vue'

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

const props = withDefaults(
  defineProps<{
    variant?: VariantProps<typeof itemVariants>['variant']
    icon?: string
    disabled?: boolean
  }>(),
  { disabled: false },
)

const emit = defineEmits<{ select: [] }>()

function onSelect() {
  if (!props.disabled) emit('select')
}
</script>

<template>
  <RekaItem :disabled="disabled" :class="itemVariants({ variant })" @select="onSelect">
    <Icon v-if="icon" :name="icon" class="size-4 shrink-0" />
    <slot />
  </RekaItem>
</template>
