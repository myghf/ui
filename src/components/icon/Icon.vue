<script setup lang="ts">
import { computed } from 'vue'
import * as Lucide from 'lucide-vue-next'
import { resolveIconName, toPascalCase } from '../../lib/icons'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 16 })

const resolved = computed(() => {
  const lucide = Lucide as unknown as Record<string, unknown>
  const pascal = toPascalCase(resolveIconName(props.name))
  return (lucide[pascal] as typeof Lucide.Circle | undefined) ?? Lucide.Circle
})
</script>

<template>
  <component :is="resolved" :size="size" aria-hidden="true" data-icon :name="name" />
</template>
