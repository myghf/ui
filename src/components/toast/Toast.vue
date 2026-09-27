<script setup lang="ts">
import { computed } from 'vue'
import {
  ToastAction as RekaToastAction,
  ToastClose,
  ToastDescription,
  ToastRoot,
  ToastTitle,
} from 'reka-ui'
import { X } from 'lucide-vue-next'
import { toneClasses, type Tone } from '../../lib/tones'
import Icon from '../icon/Icon.vue'
import type { ToastItem, ToastSeverity } from './useToast'

const props = defineProps<{
  item: ToastItem
  duration: number
}>()

const emit = defineEmits<{ close: [] }>()

const severity = computed<ToastSeverity>(() => props.item.severity ?? 'info')

/** Foreground toasts are announced assertively; background ones politely. */
const type = computed(() =>
  severity.value === 'danger' || severity.value === 'warning' ? 'foreground' : 'background',
)

const resolvedDuration = computed(() => props.item.duration ?? props.duration)

/** Fallback lucide name per severity, used when no explicit `icon` is set. */
const defaultIcons: Record<Tone, string> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-alert',
  secondary: 'info',
}
</script>

<template>
  <ToastRoot
    :default-open="true"
    :duration="resolvedDuration"
    :type="type"
    data-toast-root
    :data-duration="resolvedDuration"
    :class="[
      'pointer-events-auto flex w-full items-start gap-3 rounded-lg p-4 text-sm shadow-popover',
      toneClasses[severity].soft,
    ]"
    @update:open="(open) => !open && emit('close')"
  >
    <Icon
      :name="item.icon || defaultIcons[severity]"
      :class="['mt-0.5 size-4 shrink-0', toneClasses[severity].icon]"
    />

    <div class="min-w-0 flex-1">
      <ToastTitle v-if="item.title" class="font-medium">
        {{ item.title }}
      </ToastTitle>
      <ToastDescription
        v-if="item.description"
        :class="['leading-relaxed', item.title ? 'mt-1' : '']"
      >
        {{ item.description }}
      </ToastDescription>
    </div>

    <RekaToastAction
      v-if="item.action"
      :alt-text="item.action.label"
      class="-my-1 shrink-0 rounded-md px-2 py-1 font-medium transition-colors hover:bg-black/10 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      @click="item.action.onClick()"
    >
      {{ item.action.label }}
    </RekaToastAction>

    <ToastClose
      v-if="item.closable !== false"
      aria-label="Close"
      class="-me-1 -mt-1 shrink-0 rounded-md p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <X class="size-4" />
    </ToastClose>
  </ToastRoot>
</template>
