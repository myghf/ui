<script setup lang="ts">
import { Icon } from '@myghf/ui'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Icon name="heart" class="size-5 text-primary-500" />
    <Icon name="circle-check" class="size-5 text-success-500" />
    <Icon name="triangle-alert" class="size-5 text-warning-500" />
    <Icon name="circle-alert" class="size-5 text-error-500" />
    <Icon name="heart" class="size-5 text-foreground" />
    <Icon name="heart" class="size-5 text-muted" />
  </div>
</template>
