<script setup lang="ts">
import { ref } from 'vue'
import { Button, Drawer } from '@myghf/ui'

const open = ref(false)
</script>

<template>
  <ClientOnly>
    <Button variant="outline" @click="open = true">Open with custom dismissal</Button>

    <!--
      preventScroll only applies at all when backdrop is false: reka's overlay
      owns the body scroll lock, and this drawer renders no overlay here.
    -->
    <Drawer
      v-model:open="open"
      :backdrop="false"
      :close-on-escape="false"
      :close-on-outside="false"
      :prevent-scroll="false"
      title="Dismissal options"
      description="No dimmer and background scrolling stays enabled; Esc and outside clicks are ignored."
      size="sm"
    >
      <p class="text-sm text-muted">
        <kbd>Esc</kbd> and outside clicks are ignored, so the close button (or your own
        action) is the only way out of this demo.
      </p>
      <template #footer>
        <Button variant="outline" @click="open = false">Close</Button>
      </template>
    </Drawer>

    <template #fallback>
      <span class="text-sm text-muted">Loading drawer…</span>
    </template>
  </ClientOnly>
</template>
