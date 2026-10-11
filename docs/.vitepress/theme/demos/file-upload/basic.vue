<script setup lang="ts">
import { ref } from 'vue'
import { FileUpload } from '@myghf/ui'

const files = ref<File[]>([
  new File([new Uint8Array(240_000)], 'referral-letter.pdf', {
    type: 'application/pdf',
    lastModified: 1,
  }),
])
</script>

<template>
  <div class="grid max-w-md gap-6">
    <FileUpload v-model="files" accept=".pdf,.docx" multiple :progress-for="() => 60" />
  </div>
</template>
