<script setup lang="ts">
import { Menu } from '@lucide/vue'
import { useAppShell } from '../../lib/appShell'

withDefaults(
  defineProps<{
    /** Accessible name for the sidebar toggle button. */
    label?: string
  }>(),
  { label: 'Toggle navigation' },
)

const shell = useAppShell()
</script>

<template>
  <header
    class="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4"
  >
    <button
      v-if="shell?.collapsible"
      type="button"
      class="inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 lg:hidden"
      :aria-label="label"
      :aria-expanded="shell.open.value"
      :aria-controls="shell.sidebarId"
      @click="shell.toggle()"
    >
      <Menu class="size-4" aria-hidden="true" />
    </button>
    <slot />
  </header>
</template>
