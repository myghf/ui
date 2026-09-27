<script setup lang="ts">
import { ref } from 'vue'
import { Textarea } from '@myghf/ui'

const summary = ref('')
const capped = ref('Line one\nLine two\nLine three')
</script>

<template>
  <div class="grid max-w-md gap-6">
    <div class="grid gap-1.5">
      <label class="text-sm font-medium text-foreground" for="demo-autoresize">Summary</label>
      <Textarea
        id="demo-autoresize"
        v-model="summary"
        auto-resize
        placeholder="Type to grow the field…"
      />
    </div>

    <div class="grid gap-1.5">
      <label class="text-sm font-medium text-foreground" for="demo-maxrows">Capped at three rows</label>
      <Textarea id="demo-maxrows" v-model="capped" auto-resize :max-rows="3" />
    </div>
  </div>
</template>
