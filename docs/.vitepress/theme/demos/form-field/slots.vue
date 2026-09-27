<script setup lang="ts">
import { FormField, Label } from '@myghf/ui'
</script>

<template>
  <div class="grid max-w-sm gap-6">
    <FormField id="fd-org" invalid>
      <template #label>Organisation</template>
      <input
        id="fd-org"
        type="text"
        placeholder="MYGHF"
        aria-invalid="true"
        aria-describedby="fd-org-description fd-org-error"
        class="h-9 w-full rounded-md border border-error-500 bg-surface px-3 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-500"
      />
      <template #description>Shown on your public profile.</template>
      <template #error>An organisation is required.</template>
    </FormField>

    <div class="grid gap-2">
      <Label for="fd-plain">Standalone label</Label>
      <input
        id="fd-plain"
        type="text"
        placeholder="Works outside a FormField"
        class="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      />
    </div>
  </div>
</template>
