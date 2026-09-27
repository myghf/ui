<template>
  <div class="grid gap-3 sm:grid-cols-3">
    <div class="rounded-lg border border-border bg-surface p-4">
      <p class="text-sm font-medium text-foreground">surface</p>
      <p class="mt-1 text-xs text-muted">Cards and panels</p>
    </div>
    <div class="rounded-lg border border-border bg-surface-muted p-4">
      <p class="text-sm font-medium text-foreground">surface-muted</p>
      <p class="mt-1 text-xs text-muted">Recessed areas and hovers</p>
    </div>
    <div
      class="rounded-lg border border-primary-300 bg-primary-100 p-4 dark:border-primary-700 dark:bg-primary-900/40"
    >
      <p class="text-sm font-medium text-primary-800 dark:text-primary-200">primary tint</p>
      <p class="mt-1 text-xs text-primary-800 dark:text-primary-200">
        Brand tints follow the <code>*-900/40</code> + <code>*-200</code> rule.
      </p>
    </div>
  </div>
</template>
