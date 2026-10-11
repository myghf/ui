<script setup lang="ts">
import { onBeforeUnmount, provide, ref, useId, watch } from 'vue'
import { appShellKey } from '../../lib/appShell'

const props = withDefaults(
  defineProps<{
    /** Collapse the sidebar off-canvas below the `lg` breakpoint. */
    collapsible?: boolean
  }>(),
  { collapsible: true },
)

const open = ref(false)
const sidebarId = useId()

function toggle() {
  open.value = !open.value
}
function close() {
  open.value = false
}

provide(appShellKey, { open, toggle, close, collapsible: props.collapsible, sidebarId })

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(open, (isOpen) => {
  if (typeof window === 'undefined') return
  if (isOpen) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <slot name="topbar" />

    <div class="flex flex-1">
      <div
        v-if="collapsible && open"
        data-app-shell-backdrop
        class="fixed inset-0 z-30 bg-black/50 lg:hidden"
        aria-hidden="true"
        @click="close"
      />

      <slot name="sidebar" />

      <main class="min-w-0 flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
