<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/cn'
import { useAppShell } from '../../lib/appShell'

withDefaults(
  defineProps<{
    /** Accessible name for the navigation landmark. */
    label?: string
    /** Docked width when it is not collapsible (or used standalone). */
    width?: string
  }>(),
  { label: 'Sidebar', width: '16rem' },
)

const shell = useAppShell()

const panel = computed(() => {
  if (!shell?.collapsible) return ''
  // `start-0` is the inline start; the off-canvas offset mirrors in RTL.
  return shell.open.value ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
})
</script>

<template>
  <nav
    :id="shell?.sidebarId"
    :aria-label="label"
    :class="
      cn(
        'z-40 shrink-0 border-e border-border bg-surface',
        shell?.collapsible
          ? cn(
              'fixed inset-y-0 start-0 w-64 overflow-y-auto transition-transform lg:static lg:!translate-x-0',
              panel,
            )
          : 'static',
      )
    "
    :style="shell?.collapsible ? undefined : { width }"
  >
    <slot />
  </nav>
</template>
