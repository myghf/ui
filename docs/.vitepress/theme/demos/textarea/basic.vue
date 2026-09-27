<script setup lang="ts">
import { ref } from 'vue'
import { Textarea } from '@myghf/ui'

const notes = ref('Follow up in two weeks.')
const empty = ref('')
</script>

<template>
  <div class="grid max-w-md gap-4">
    <div class="grid gap-1.5">
      <label class="text-sm font-medium text-foreground" for="demo-notes">Clinical notes</label>
      <Textarea id="demo-notes" v-model="notes" :rows="4" />
    </div>

    <Textarea v-model="empty" placeholder="Disabled" disabled aria-label="Disabled notes" />
  </div>
</template>
