<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@myghf/ui'

const tab = ref('overview')
</script>

<template>
  <Tabs v-model="tab" class="max-w-md">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="vitals">Vitals</TabsTrigger>
      <TabsTrigger value="history" disabled>History</TabsTrigger>
    </TabsList>

    <TabsContent value="overview">
      <p class="text-sm text-muted">Summary of the patient's current episode of care.</p>
    </TabsContent>
    <TabsContent value="vitals">
      <p class="text-sm text-muted">Heart rate, blood pressure, and oxygen saturation.</p>
    </TabsContent>
    <TabsContent value="history">
      <p class="text-sm text-muted">This panel is unreachable while its trigger is disabled.</p>
    </TabsContent>
  </Tabs>

  <p class="mt-3 text-sm text-muted">Active tab: {{ tab }}</p>
</template>
