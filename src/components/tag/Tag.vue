<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { toneClasses, type Tone } from '../../lib/tones'
import Icon from '../icon/Icon.vue'

withDefaults(
  defineProps<{
    tone?: Tone
    icon?: string
    removable?: boolean
    removeLabel?: string
  }>(),
  { tone: 'secondary', removeLabel: 'Remove' },
)

const emit = defineEmits<{ remove: [] }>()

export type TagTone = Tone
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
      toneClasses[tone].soft,
    ]"
  >
    <Icon v-if="icon" :name="icon" class="size-3" />
    <slot />
    <button
      v-if="removable"
      type="button"
      :aria-label="removeLabel"
      class="-me-0.5 ms-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      @click.stop="emit('remove')"
    >
      <X class="size-3" />
    </button>
  </span>
</template>
