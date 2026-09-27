<script setup lang="ts">
import { Button, useToast } from '@myghf/ui'

// This component is a descendant of <Toaster>, so the inject resolves.
const toast = useToast()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Button variant="outline" size="sm" @click="toast.success('Saved', 'Your changes were saved.')">
      Success
    </Button>
    <Button variant="outline" size="sm" @click="toast.warning('Unsaved changes', 'Save before leaving.')">
      Warning
    </Button>
    <Button variant="outline" size="sm" @click="toast.danger('Upload failed', 'Check your connection and retry.')">
      Danger
    </Button>
  </div>
</template>
