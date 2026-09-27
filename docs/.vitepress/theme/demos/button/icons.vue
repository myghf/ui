<script setup lang="ts">
import { Button } from '@myghf/ui'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <Button icon="plus">New patient</Button>
    <Button variant="outline" icon="download">Export</Button>
    <Button variant="outline" icon-trailing="arrow-right">Continue</Button>
    <Button variant="ghost" icon="trash-2" icon-pos="end">Delete</Button>
    <Button loading icon="refresh-cw">Saving</Button>
    <Button loading icon-trailing="chevron-down">Publishing</Button>
  </div>
</template>
