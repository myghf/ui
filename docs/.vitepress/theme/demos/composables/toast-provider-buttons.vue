<script setup lang="ts">
import { Button, useToast } from '@myghf/ui'

// This component is a descendant of <Toaster>, so the inject resolves.
const toast = useToast()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Button size="sm" variant="outline" @click="toast.success('Saved', 'Your changes were saved.')">
      success()
    </Button>
    <Button size="sm" variant="outline" @click="toast.warning('Unsaved changes', 'Save before leaving.')">
      warning()
    </Button>
    <Button size="sm" variant="ghost" @click="toast.clear()">clear()</Button>
  </div>
</template>
