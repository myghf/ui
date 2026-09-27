<script setup lang="ts">
import { computed } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { useTheme } from '../../lib/theme'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'default' | 'lg'
    label?: string
  }>(),
  { size: 'default', label: 'Toggle theme' },
)

const { isDark, toggle } = useTheme()

const SIZE_CLASSES: Record<'sm' | 'default' | 'lg', string> = {
  sm: 'h-8 px-3 text-xs',
  default: 'h-9 px-4',
  lg: 'h-10 px-6',
}

// Mirrors Button's `ghost` variant sizing/hover/focus treatment.
const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors',
  'text-foreground hover:bg-surface-muted',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
  SIZE_CLASSES[props.size],
])
</script>

<template>
  <button
    type="button"
    :class="classes"
    :aria-label="label"
    :aria-pressed="isDark"
    @click="toggle()"
  >
    <Sun v-if="isDark" />
    <Moon v-else />
  </button>
</template>
