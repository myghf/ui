<script setup lang="ts">
import { computed } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    visible?: boolean
    title?: string
    description?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  { size: 'md' },
)

const emit = defineEmits<{ 'update:visible': [value: boolean]; close: [] }>()

const open = computed({
  get: () => props.visible ?? false,
  set: (v: boolean) => emit('update:visible', v),
})

const widths: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

function onOpenChange(v: boolean) {
  emit('update:visible', v)
  if (!v) emit('close')
}
</script>

<template>
  <DialogRoot :open="open" @update:open="onOpenChange">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent
        :class="[
          'fixed left-1/2 top-1/2 z-50 w-full max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-border bg-surface shadow-dialog focus-visible:outline-none',
          widths[size],
        ]"
      >
        <div class="flex items-start justify-between gap-4 border-b border-border p-5 pb-4">
          <div class="min-w-0">
            <DialogTitle v-if="title || $slots.header" class="text-lg font-semibold text-foreground">
              <slot name="header">{{ title }}</slot>
            </DialogTitle>
            <DialogDescription v-if="description || $slots.description" class="mt-1 text-sm text-muted">
              <slot name="description">{{ description }}</slot>
            </DialogDescription>
          </div>
          <DialogClose
            class="rounded-md p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Close"
          >
            <X class="size-4" />
          </DialogClose>
        </div>
        <div class="overflow-y-auto bg-surface p-5">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex justify-end gap-2 border-t border-border bg-surface-muted p-4">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
