<script setup lang="ts">
import { ref } from 'vue'
import { Alert, Button, Message } from '@myghf/ui'

const visible = ref(true)
const timerKey = ref(0)
</script>

<template>
  <div class="flex flex-col gap-3">
    <Message
      v-if="visible"
      tone="danger"
      variant="outline"
      show-icon
      closable
      title="Could not publish"
      description="Check your connection and try again."
      @close="visible = false"
    >
      <template #actions>
        <Button size="sm" variant="outline" @click="visible = false">Retry</Button>
      </template>
    </Message>
    <Button v-else size="sm" variant="outline" @click="visible = true">Show message again</Button>

    <Alert
      :key="timerKey"
      tone="success"
      show-icon
      closable
      :duration="5000"
      title="Auto-dismiss in 5s"
      description="Hover or focus the alert to pause the timer."
    />
    <Button size="sm" variant="outline" @click="timerKey += 1">Restart timer</Button>
  </div>
</template>
