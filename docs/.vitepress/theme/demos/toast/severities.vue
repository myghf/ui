<script setup lang="ts">
import { Button, Toaster, createToastStore } from '@myghf/ui'

const store = createToastStore({ position: 'top-end', max: 4, duration: 5000 })

function persistent() {
  store.add({ title: 'Uploading…', severity: 'info', duration: 0 })
}

function withAction() {
  store.add({
    title: 'Item archived',
    description: 'Undo within 10 seconds.',
    severity: 'warning',
    action: { label: 'Undo', onClick: () => store.info('Restored', 'The item is back.') },
  })
}
</script>

<template>
  <ClientOnly>
    <Toaster :store="store" />

    <div class="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" @click="store.info('Heads up', 'A new result is available.')">
        Info
      </Button>
      <Button variant="outline" size="sm" @click="store.success('Saved', 'Your changes were saved.')">
        Success
      </Button>
      <Button variant="outline" size="sm" @click="store.warning('Unsaved changes', 'Save before leaving.')">
        Warning
      </Button>
      <Button variant="outline" size="sm" @click="store.danger('Upload failed', 'Check your connection and retry.')">
        Danger
      </Button>
      <Button variant="outline" size="sm" @click="store.secondary('Draft', 'Saved locally only.')">
        Secondary
      </Button>
      <Button variant="outline" size="sm" @click="persistent()">Persistent (duration 0)</Button>
      <Button variant="outline" size="sm" @click="withAction()">With action</Button>
      <Button variant="ghost" size="sm" @click="store.clear()">Clear</Button>
    </div>

    <template #fallback>
      <span class="text-sm text-muted">Loading toasts…</span>
    </template>
  </ClientOnly>
</template>
