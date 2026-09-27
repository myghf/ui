<script setup lang="ts">
import { Skeleton } from '@myghf/ui'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-4">
      <Skeleton width="3rem" height="3rem" rounded="full" />
      <Skeleton width="3rem" height="3rem" rounded="lg" />
      <Skeleton width="3rem" height="3rem" rounded="none" />
    </div>

    <div class="flex max-w-sm flex-col gap-2">
      <Skeleton width="40%" height="0.75rem" />
      <Skeleton width="100%" height="0.75rem" />
      <Skeleton width="80%" height="0.75rem" />
    </div>

    <div class="flex max-w-sm items-center gap-3">
      <Skeleton width="2.5rem" height="2.5rem" rounded="full" />
      <div class="flex flex-1 flex-col gap-2">
        <Skeleton width="60%" height="0.75rem" />
        <Skeleton width="90%" height="0.75rem" />
      </div>
    </div>

    <Skeleton width="12rem" height="5rem" rounded="lg">
      <p class="flex h-full items-center justify-center text-sm text-muted">
        Slot content replaces the empty block
      </p>
    </Skeleton>
  </div>
</template>
