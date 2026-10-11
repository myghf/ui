<script setup lang="ts">
import { Button, Container, Grid, Inline, Stack } from '@myghf/ui'
</script>

<template>
  <Container size="sm" class="rounded-lg bg-surface-muted p-4">
    <Stack gap="lg">
      <Inline gap="sm">
        <Button size="sm">Save</Button>
        <Button size="sm" variant="outline">Cancel</Button>
      </Inline>

      <Grid :cols="3" gap="sm">
        <div class="rounded-md border border-border bg-surface p-3 text-sm">Alpha</div>
        <div class="rounded-md border border-border bg-surface p-3 text-sm">Beta</div>
        <div class="rounded-md border border-border bg-surface p-3 text-sm">Gamma</div>
      </Grid>
    </Stack>
  </Container>
</template>
