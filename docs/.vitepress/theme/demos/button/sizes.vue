<script setup lang="ts">
import { Button, Icon } from '@myghf/ui'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <Button size="icon" aria-label="Search"><Icon name="search" /></Button>
      <Button size="icon-sm" aria-label="Search"><Icon name="search" /></Button>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
      <Button label="From the label prop" />
    </div>
  </div>
</template>
