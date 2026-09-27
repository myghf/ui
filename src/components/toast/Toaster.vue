<script setup lang="ts">
import { provide } from 'vue'
import { ToastProvider, ToastViewport } from 'reka-ui'
import { createToastStore, toastKey, type ToastPosition, type ToastStore } from './useToast'
import Toast from './Toast.vue'

const props = withDefaults(
  defineProps<{
    position?: ToastPosition
    max?: number
    duration?: number
    gap?: string
    label?: string
    store?: ToastStore
  }>(),
  {
    position: 'top-end',
    max: 4,
    duration: 5000,
    gap: '0.5rem',
    label: 'Notifications',
  },
)

const toastStore = props.store ?? createToastStore({
  max: props.max,
  duration: props.duration,
  position: props.position,
})

provide(toastKey, toastStore)

const POSITIONS: ToastPosition[] = [
  'top-start', 'top-center', 'top-end',
  'bottom-start', 'bottom-center', 'bottom-end',
]

const viewportPosition: Record<ToastPosition, string> = {
  'top-start': 'top-0 start-0',
  'top-center': 'top-0 inset-x-0 mx-auto',
  'top-end': 'top-0 end-0',
  'bottom-start': 'bottom-0 start-0',
  'bottom-center': 'bottom-0 inset-x-0 mx-auto',
  'bottom-end': 'bottom-0 end-0',
}

function itemsFor(position: ToastPosition) {
  return toastStore.visible.value.filter((item) => (item.position ?? props.position) === position)
}
</script>

<template>
  <ToastProvider :label="label" :duration="duration">
    <template v-for="pos in POSITIONS" :key="pos">
      <ToastViewport
        v-if="itemsFor(pos).length > 0"
        :label="label"
        :class="[
          'pointer-events-none fixed z-50 flex max-h-screen w-full max-w-sm flex-col',
          viewportPosition[pos],
        ]"
        :style="{ gap }"
      >
        <Toast
          v-for="item in itemsFor(pos)"
          :key="item.id"
          :item="item"
          :duration="duration"
          @close="toastStore.remove(item.id)"
        />
      </ToastViewport>
    </template>
  </ToastProvider>
</template>
