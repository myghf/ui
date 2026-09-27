<script setup lang="ts">
import { Button, Toaster, createToastStore } from '@myghf/ui'

// A store you own, rather than the one <Toaster> would create.
const store = createToastStore({ max: 2, duration: 6000, position: 'bottom-end' })

let queued = 0

function queue() {
  queued += 1
  store.add({
    title: `Queued toast ${queued}`,
    description: 'max is 2, so extras wait until a slot frees up.',
    severity: 'success',
  })
}
</script>

<template>
  <ClientOnly>
    <Toaster :store="store" />

    <div class="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" @click="store.info('Info', 'From an external store.')">
        store.info()
      </Button>
      <Button size="sm" variant="outline" @click="store.danger('Failed', 'Stored outside the Toaster.')">
        store.danger()
      </Button>
      <Button size="sm" @click="queue()">Queue one (max 2)</Button>
      <Button size="sm" variant="ghost" @click="store.clear()">store.clear()</Button>
    </div>

    <template #fallback>
      <span class="text-sm text-muted">Loading toasts…</span>
    </template>
  </ClientOnly>
</template>
