<script setup lang="ts">
import { TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'

withDefaults(
  defineProps<{
    /** Tooltip text. Falls back to the `content` slot. */
    text?: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    /** Milliseconds before the tooltip opens on hover. */
    delayDuration?: number
  }>(),
  { side: 'top', align: 'center', sideOffset: 6, delayDuration: 300 },
)
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="side"
          :align="align"
          :side-offset="sideOffset"
          class="z-50 max-w-xs rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground shadow-popover"
        >
          <slot name="content">{{ text }}</slot>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
