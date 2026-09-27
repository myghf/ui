<template>
  <div class="grid gap-3 sm:grid-cols-2">
    <div dir="ltr" class="rounded-lg border border-border bg-surface p-4">
      <p class="text-xs uppercase tracking-wide text-muted">dir="ltr"</p>
      <div class="mt-2 flex items-center rounded bg-surface-muted py-2 pe-2 ps-4 text-sm text-foreground">
        <span><code>ps-4</code> / <code>pe-2</code></span>
      </div>
    </div>
    <div dir="rtl" lang="ar" class="font-ar rounded-lg border border-border bg-surface p-4">
      <p class="text-xs uppercase tracking-wide text-muted">dir="rtl"</p>
      <div class="mt-2 flex items-center rounded bg-surface-muted py-2 pe-2 ps-4 text-sm text-foreground">
        <span><code>ps-4</code> / <code>pe-2</code></span>
      </div>
    </div>
  </div>
</template>
