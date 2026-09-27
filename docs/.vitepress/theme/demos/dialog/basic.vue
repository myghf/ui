<script setup lang="ts">
import { ref } from 'vue'
import { Button, Dialog } from '@myghf/ui'

const visible = ref(false)
const published = ref(false)

function publish() {
  visible.value = false
  published.value = true
}
</script>

<template>
  <!-- Dialog/Drawer portals need a browser, so keep the demo client-only. -->
  <ClientOnly>
    <Dialog
      v-model:visible="visible"
      title="Publish changes"
      description="This will update the live site."
    >
      <p class="text-sm text-muted">You can keep editing after publishing.</p>
      <template #footer>
        <Button variant="outline" @click="visible = false">Cancel</Button>
        <Button @click="publish()">Publish</Button>
      </template>
      <template #trigger>
        <Button>Open dialog</Button>
      </template>
    </Dialog>

    <p v-if="published" class="mt-3 text-sm text-muted">Published (demo only).</p>

    <template #fallback>
      <span class="text-sm text-muted">Loading dialog…</span>
    </template>
  </ClientOnly>
</template>
