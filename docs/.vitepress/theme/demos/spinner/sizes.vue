<script setup lang="ts">
import { Spinner } from '@myghf/ui'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
    </div>

    <div class="flex items-center gap-6">
      <Spinner tone="info" label="Finding results" />
      <Spinner tone="success" label="Saving" />
      <Spinner tone="warning" label="Syncing" />
      <Spinner tone="danger" label="Retrying" />
      <Spinner tone="secondary" label="Loading more" />
    </div>

    <p class="flex items-center gap-2 text-sm text-muted">
      <Spinner size="sm" label="Loading reports" />
      Loading reports…
    </p>
  </div>
</template>
