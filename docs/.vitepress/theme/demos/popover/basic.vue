<script setup lang="ts">
import { ref } from 'vue'
import { Button, Popover } from '@myghf/ui'

const open = ref(false)
</script>

<template>
  <Popover v-model:open="open">
    <template #trigger>
      <Button size="sm">Filters</Button>
    </template>
    <p class="text-sm text-muted">Configure the record filters here.</p>
  </Popover>
</template>
