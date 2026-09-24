<script setup lang="ts">
import { DropdownMenuTrigger as RekaTrigger } from 'reka-ui'
</script>

<template>
  <RekaTrigger as-child focus-on-select>
    <slot />
  </RekaTrigger>
</template>
