<script setup lang="ts">
import { Breadcrumbs, Button, PageContent, PageHeader } from '@myghf/ui'

const items = [{ label: 'Patients', href: '#' }, { label: 'Amina Farouk' }]
</script>

<template>
  <div class="rounded-lg border border-border bg-surface">
    <PageContent size="md">
      <PageHeader title="Amina Farouk" description="Patient record">
        <template #breadcrumbs>
          <Breadcrumbs :items="items" />
        </template>
        <template #actions>
          <Button size="sm">Edit</Button>
        </template>
      </PageHeader>
      <p class="mt-6 text-sm text-muted">Page content goes here.</p>
    </PageContent>
  </div>
</template>
