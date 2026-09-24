<script setup lang="ts">
import { DropdownMenuContent as RekaContent, DropdownMenuPortal as RekaPortal } from 'reka-ui'

withDefaults(
  defineProps<{
    align?: 'start' | 'center' | 'end'
    side?: 'top' | 'right' | 'bottom' | 'left'
    sideOffset?: number
  }>(),
  { align: 'start', side: 'bottom', sideOffset: 4 },
)
</script>

<template>
  <RekaPortal>
    <RekaContent
      :align="align"
      :side="side"
      :side-offset="sideOffset"
      class="z-50 min-w-40 rounded-md border border-border bg-surface p-1 shadow-popover"
    >
      <slot />
    </RekaContent>
  </RekaPortal>
</template>
