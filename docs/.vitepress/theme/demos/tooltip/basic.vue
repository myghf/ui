<script setup lang="ts">
import { Button, Tooltip } from '@myghf/ui'
</script>

<template>
  <div class="flex gap-2">
    <Tooltip text="Saves and closes the record">
      <Button size="sm">Save</Button>
    </Tooltip>
    <Tooltip text="Deletes the record" side="bottom">
      <Button size="sm" variant="outline">Delete</Button>
    </Tooltip>
  </div>
</template>
