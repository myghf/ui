<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { cn } from '../../lib/cn'
import { toneClasses } from '../../lib/tones'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    name?: string
    initials?: string
    size?: 'sm' | 'default' | 'lg' | 'xl'
  }>(),
  { size: 'default' },
)

const SIZE_CLASSES: Record<'sm' | 'default' | 'lg' | 'xl', string> = {
  sm: 'size-6 text-xs',
  default: 'size-8 text-sm',
  lg: 'size-10 text-base',
  xl: 'size-14 text-lg',
}

function deriveInitials(name?: string): string {
  if (!name) return ''
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
}

const initials = computed(() => props.initials ?? deriveInitials(props.name))
const sizeClass = computed(() => SIZE_CLASSES[props.size])

const errored = ref(false)
watch(
  () => props.src,
  () => {
    errored.value = false
  },
)
</script>

<template>
  <img
    v-if="src && !errored"
    :src="src"
    :alt="alt"
    :class="cn(sizeClass, 'shrink-0 rounded-full object-cover')"
    @error="errored = true"
  />
  <span
    v-else
    role="img"
    :aria-label="alt ?? name ?? initials"
    :class="
      cn(
        sizeClass,
        toneClasses.info.soft,
        'inline-flex shrink-0 items-center justify-center rounded-full font-medium',
      )
    "
    >{{ initials }}</span
  >
</template>
