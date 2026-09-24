<script setup lang="ts">
defineProps<{ columns: number; label?: string }>()
</script>

<template>
  <tr>
    <td :colspan="columns" class="px-3 py-8 text-center text-sm text-muted">
      <slot>{{ label }}</slot>
    </td>
  </tr>
</template>
