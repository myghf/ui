<script setup lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import { X } from 'lucide-vue-next'
import Icon from '../icon/Icon.vue'

const tagVariants = tv({
  base: 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
  variants: {
    tone: {
      info: 'bg-primary-100 text-primary-800',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      danger: 'bg-error-100 text-error-800',
      secondary: 'bg-surface-muted text-foreground',
    },
  },
  defaultVariants: { tone: 'secondary' },
})

withDefaults(
  defineProps<{
    tone?: VariantProps<typeof tagVariants>['tone']
    icon?: string
    removable?: boolean
    removeLabel?: string
  }>(),
  { removeLabel: 'Remove' },
)

const emit = defineEmits<{ remove: [] }>()

export type TagTone = NonNullable<VariantProps<typeof tagVariants>['tone']>
</script>

<template>
  <span :class="tagVariants({ tone })">
    <Icon v-if="icon" :name="icon" class="size-3" />
    <slot />
    <button
      v-if="removable"
      type="button"
      :aria-label="removeLabel"
      class="-me-0.5 ms-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      @click.stop="emit('remove')"
    >
      <X class="size-3" />
    </button>
  </span>
</template>
