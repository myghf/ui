<script setup lang="ts">
import { ref } from 'vue'
import { Button, Dialog } from '@myghf/ui'

type DialogSize = 'sm' | 'md' | 'lg' | 'xl'

const visible = ref(false)
const size = ref<DialogSize>('md')
const sizes: DialogSize[] = ['sm', 'md', 'lg', 'xl']

function open(next: DialogSize) {
  size.value = next
  visible.value = true
}
</script>

<template>
  <ClientOnly>
    <div class="flex flex-wrap gap-2">
      <Button v-for="s in sizes" :key="s" variant="outline" @click="open(s)">
        {{ s }}
      </Button>
    </div>

    <Dialog
      v-model:visible="visible"
      :size="size"
      :title="'Size: ' + size"
      description="The panel max-width follows the size prop."
    >
      <p class="text-sm text-muted">
        <code>sm</code> → <code>max-w-sm</code>, <code>md</code> → <code>max-w-md</code>,
        <code>lg</code> → <code>max-w-2xl</code>, <code>xl</code> → <code>max-w-4xl</code>.
      </p>
      <template #footer>
        <Button variant="outline" @click="visible = false">Close</Button>
      </template>
    </Dialog>

    <template #fallback>
      <span class="text-sm text-muted">Loading dialog…</span>
    </template>
  </ClientOnly>
</template>
