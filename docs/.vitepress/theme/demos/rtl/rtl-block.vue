<script setup lang="ts">
import { Button } from '@myghf/ui'
</script>

<template>
  <section dir="rtl" lang="ar" class="font-ar rounded-lg border border-border bg-surface p-5">
    <h3 class="text-lg font-medium text-foreground">مؤسسة مجدي يعقوب</h3>
    <p class="mt-1 text-sm text-muted">
      هذا نص توضيحي بخط «GE SS Two» داخل حاوية RTL. المسافات تُحسب من جهة البداية.
    </p>
    <div class="mt-4 flex items-center gap-2">
      <Button variant="default">ابدأ</Button>
      <Button variant="outline">إلغاء</Button>
    </div>
  </section>
</template>
