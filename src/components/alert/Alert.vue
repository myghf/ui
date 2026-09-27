<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { X } from 'lucide-vue-next'
import { toneClasses, type Tone } from '../../lib/tones'
import Icon from '../icon/Icon.vue'

export type AlertVariant = 'soft' | 'outline'

const props = withDefaults(
  defineProps<{
    tone?: Tone
    title?: string
    description?: string
    icon?: string
    showIcon?: boolean
    closable?: boolean
    duration?: number
    closeLabel?: string
    variant?: AlertVariant
  }>(),
  {
    tone: 'info',
    showIcon: false,
    closable: false,
    closeLabel: 'Close',
    variant: 'soft',
  },
)

const emit = defineEmits<{ close: [] }>()

/** Fallback lucide name per tone, used when `showIcon` is set but `icon` is not. */
const defaultIcons: Record<Tone, string> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-alert',
  secondary: 'info',
}

const dismissed = ref(false)
const hovered = ref(false)
const focused = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined
/** Absolute ms timestamp when the active timer would fire. */
let deadline = 0
/** Ms left when the timer was paused; drives resume. */
let remaining = 0

function clearTimer() {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

function start(ms: number) {
  clearTimer()
  if (ms <= 0) return
  remaining = ms
  deadline = Date.now() + ms
  timer = setTimeout(dismiss, ms)
}

function pause() {
  if (timer === undefined) return
  clearTimer()
  remaining = Math.max(0, deadline - Date.now())
}

/**
 * Re-arms the timer only once both pause sources are released. If the remaining
 * time floored to zero while paused, dismiss immediately instead of stranding.
 */
function maybeResume() {
  if (dismissed.value || hovered.value || focused.value || timer !== undefined) return
  if (!props.duration || props.duration <= 0) return
  if (remaining <= 0) {
    dismiss()
    return
  }
  start(remaining)
}

function onEnter() {
  hovered.value = true
  pause()
}

function onLeave() {
  hovered.value = false
  maybeResume()
}

function onFocusIn() {
  focused.value = true
  pause()
}

function onFocusOut() {
  focused.value = false
  maybeResume()
}

function dismiss() {
  if (dismissed.value) return
  dismissed.value = true
  clearTimer()
  emit('close')
}

onMounted(() => {
  if (props.duration && props.duration > 0) start(props.duration)
})

onBeforeUnmount(clearTimer)
</script>

<template>
  <div
    v-if="!dismissed"
    :role="toneClasses[tone].role"
    :class="[
      'flex w-full items-start gap-3 rounded-lg p-4 text-sm',
      toneClasses[tone][variant],
    ]"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <slot name="icon">
      <Icon
        v-if="showIcon"
        :name="icon || defaultIcons[tone]"
        :class="['mt-0.5 size-4 shrink-0', toneClasses[tone].icon]"
      />
    </slot>

    <div class="min-w-0 flex-1">
      <p v-if="title || $slots.title" class="font-medium">
        <slot name="title">{{ title }}</slot>
      </p>
      <div
        v-if="description || $slots.description"
        :class="['leading-relaxed', title || $slots.title ? 'mt-1' : '']"
      >
        <slot name="description">{{ description }}</slot>
      </div>
      <slot />
    </div>

    <slot name="actions" />

    <button
      v-if="closable"
      type="button"
      :aria-label="closeLabel"
      class="-me-1 -mt-1 ms-auto shrink-0 rounded-md p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      @click="dismiss"
    >
      <slot name="close"><X class="size-4" /></slot>
    </button>
  </div>
</template>
