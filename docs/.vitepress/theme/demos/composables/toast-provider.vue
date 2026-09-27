<script setup lang="ts">
import { Toaster } from '@myghf/ui'
import ToastProviderButtons from './toast-provider-buttons.vue'
</script>

<template>
  <ClientOnly>
    <Toaster>
      <ToastProviderButtons />
    </Toaster>

    <template #fallback>
      <span class="text-sm text-muted">Loading toasts…</span>
    </template>
  </ClientOnly>
</template>
