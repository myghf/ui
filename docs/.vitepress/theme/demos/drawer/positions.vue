<script setup lang="ts">
import { ref } from 'vue'
import { Button, Drawer, type DrawerPosition } from '@myghf/ui'

const open = ref(false)
const position = ref<DrawerPosition>('right')
const positions: DrawerPosition[] = ['left', 'right', 'top', 'bottom', 'start', 'end']

function show(next: DrawerPosition) {
  position.value = next
  open.value = true
}
</script>

<template>
  <ClientOnly>
    <div class="flex flex-wrap gap-2">
      <Button v-for="p in positions" :key="p" variant="outline" size="sm" @click="show(p)">
        {{ p }}
      </Button>
    </div>

    <Drawer
      v-model:open="open"
      :position="position"
      :title="'Position: ' + position"
      description="start/end mirror left/right and flip under RTL."
    >
      <p class="text-sm text-muted">
        The panel slides in from the chosen edge. Vertical positions ignore the horizontal
        size and clamp their height instead.
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
