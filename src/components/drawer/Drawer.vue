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
  VisuallyHidden,
} from 'reka-ui'
import { X } from 'lucide-vue-next'

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'start' | 'end'
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full'

const props = withDefaults(
  defineProps<{
    open?: boolean
    position?: DrawerPosition
    size?: DrawerSize
    backdrop?: boolean
    closeOnEscape?: boolean
    closeOnOutside?: boolean
    title?: string
    description?: string
    showClose?: boolean
    preventScroll?: boolean
  }>(),
  {
    open: false,
    position: 'right',
    size: 'md',
    backdrop: true,
    closeOnEscape: true,
    closeOnOutside: true,
    showClose: true,
    preventScroll: true,
  },
)

const emit = defineEmits<{ 'update:open': [value: boolean]; open: []; close: [] }>()

const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value),
})

function onOpenChange(value: boolean) {
  emit('update:open', value)
  if (value) emit('open')
  else emit('close')
}

/**
 * Reka dismisses on Escape itself; cancelling the default is what blocks the
 * dismissal, so we only preventDefault when the consumer opted out.
 */
function onEscapeKeyDown(event: KeyboardEvent) {
  if (!props.closeOnEscape) event.preventDefault()
}

/** Same contract for outside pointer/focus/inert dismissal. */
function onPointerDownOutside(event: Event) {
  if (!props.closeOnOutside) event.preventDefault()
}

/** Physical `left`/`right`; `start`/`end` mirror them and flip in RTL. */
const positionClasses: Record<DrawerPosition, string> = {
  right: 'inset-y-0 right-0 h-full w-full data-[state=closed]:translate-x-full data-[state=open]:translate-x-0',
  left: 'inset-y-0 left-0 h-full w-full data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0',
  end: 'inset-y-0 end-0 h-full w-full data-[state=closed]:translate-x-full rtl:data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0',
  start: 'inset-y-0 start-0 h-full w-full data-[state=closed]:-translate-x-full rtl:data-[state=closed]:translate-x-full data-[state=open]:translate-x-0',
  top: 'inset-x-0 top-0 w-full h-full data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0',
  bottom: 'inset-x-0 bottom-0 w-full h-full data-[state=closed]:translate-y-full data-[state=open]:translate-y-0',
}

const horizontalSizes: Record<DrawerSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  full: 'max-w-full',
}

const verticalSizes: Record<DrawerSize, string> = {
  sm: 'max-h-64',
  md: 'max-h-96',
  lg: 'max-h-[32rem]',
  full: 'max-h-full',
}

const isVertical = computed(() => props.position === 'top' || props.position === 'bottom')
const sizeClass = computed(() => (isVertical.value ? verticalSizes[props.size] : horizontalSizes[props.size]))
</script>

<template>
  <DialogRoot :open="open" @update:open="onOpenChange">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <!--
      `force-mount` mirrors `open` so the portal's first render is synchronous when
      the drawer starts open (reka's Teleport defers its children until mounted).
      Once mounted the portal stays put, so presence/animation still work on close.
    -->
    <DialogPortal :force-mount="open">
      <DialogOverlay v-if="backdrop" class="fixed inset-0 z-50 bg-black/50 dark:bg-black/70" />
      <DialogContent
        :prevent-scroll="preventScroll"
        :class="[
          'fixed z-50 flex flex-col overflow-hidden border-border bg-surface shadow-dialog transition-transform duration-200 focus-visible:outline-none',
          positionClasses[position],
          sizeClass,
        ]"
        @escape-key-down="onEscapeKeyDown"
        @pointer-down-outside="onPointerDownOutside"
      >
        <VisuallyHidden v-if="!title && !$slots.header">
          <DialogTitle>Drawer</DialogTitle>
        </VisuallyHidden>

        <header
          v-if="title || $slots.header || description || $slots.description || showClose"
          class="flex shrink-0 items-start justify-between gap-4 border-b border-border p-5 pb-4"
        >
          <div class="min-w-0">
            <DialogTitle
              v-if="title || $slots.header"
              class="text-lg font-semibold text-foreground"
            >
              <slot name="header">{{ title }}</slot>
            </DialogTitle>
            <DialogDescription
              v-if="description || $slots.description"
              class="mt-1 text-sm text-muted"
            >
              <slot name="description">{{ description }}</slot>
            </DialogDescription>
          </div>
          <DialogClose
            v-if="showClose"
            class="ms-auto shrink-0 rounded-md p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Close"
          >
            <slot name="close"><X class="size-4" /></slot>
          </DialogClose>
        </header>

        <div class="flex-1 overflow-y-auto p-5">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="shrink-0 border-t border-border bg-surface-muted p-4">
          <slot name="footer" />
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
