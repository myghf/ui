<script setup lang="ts">
import { Button, Icon } from '@myghf/ui'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div dir="ltr" class="flex flex-wrap items-center gap-2">
      <Button><Icon name="save" /> Save changes</Button>
      <Button variant="outline">Cancel</Button>
    </div>
    <div dir="rtl" lang="ar" class="font-ar flex flex-wrap items-center gap-2">
      <Button><Icon name="save" /> حفظ التغييرات</Button>
      <Button variant="outline">إلغاء</Button>
    </div>
  </div>
</template>
