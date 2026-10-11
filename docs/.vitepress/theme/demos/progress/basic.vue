<script setup lang="ts">
import { Progress } from '@myghf/ui'
</script>

<template>
  <div class="grid max-w-md gap-4">
    <Progress :model-value="45" label="Upload progress" />
    <Progress :model-value="80" tone="success" size="sm" label="Records synced" />
    <Progress :model-value="25" tone="danger" size="lg" label="Import failed" />
    <Progress label="Loading" />
  </div>
</template>
