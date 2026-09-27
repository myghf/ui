<script setup lang="ts">
import { Toaster } from '@myghf/ui'
import UseToastButtons from './use-toast-buttons.vue'
</script>

<template>
  <ClientOnly>
    <Toaster>
      <UseToastButtons />
    </Toaster>

    <template #fallback>
      <span class="text-sm text-muted">Loading toasts…</span>
    </template>
  </ClientOnly>
</template>
