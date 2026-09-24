<script setup lang="ts">
import { DropdownMenuRoot } from 'reka-ui'

const emit = defineEmits<{ 'update:open': [value: boolean] }>()
</script>

<template>
  <DropdownMenuRoot v-bind="$attrs" @update:open="emit('update:open', $event as boolean)">
    <slot />
  </DropdownMenuRoot>
</template>
