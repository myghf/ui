<script setup lang="ts">
import { Alert } from '@myghf/ui'
</script>

<template>
  <div class="flex flex-col gap-3">
    <Alert tone="info" show-icon title="Information" description="A new policy takes effect next month." />
    <Alert tone="success" show-icon title="Saved" description="Your changes were saved successfully." />
    <Alert tone="warning" show-icon title="Storage almost full" description="Free up space to keep syncing." />
    <Alert tone="danger" show-icon title="Upload failed" description="The connection dropped. Try again." />
    <Alert tone="secondary" show-icon title="Tip" description="Use tones to match the message, not the other way round." />
  </div>
</template>
