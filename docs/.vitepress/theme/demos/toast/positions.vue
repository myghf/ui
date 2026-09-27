<script setup lang="ts">
import { Button, Toaster, createToastStore, type ToastPosition } from '@myghf/ui'

const store = createToastStore({ position: 'top-end', max: 2, duration: 6000 })
const positions: ToastPosition[] = [
  'top-start',
  'top-center',
  'top-end',
  'bottom-start',
  'bottom-center',
  'bottom-end',
]

function push(position: ToastPosition) {
  store.add({ title: position, description: 'Per-toast position override.', position })
}

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
      <Button v-for="p in positions" :key="p" variant="outline" size="sm" @click="push(p)">
        {{ p }}
      </Button>
      <Button size="sm" @click="queue()">Queue one (max 2)</Button>
      <Button variant="ghost" size="sm" @click="store.clear()">Clear</Button>
    </div>

    <template #fallback>
      <span class="text-sm text-muted">Loading toasts…</span>
    </template>
  </ClientOnly>
</template>
