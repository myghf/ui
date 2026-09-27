<script setup lang="ts">
import { ref } from 'vue'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@myghf/ui'

const tab = ref('alpha')
</script>

<template>
  <div class="space-y-3">
    <Tabs v-model="tab" class="max-w-md">
      <TabsList>
        <TabsTrigger value="alpha">Alpha</TabsTrigger>
        <TabsTrigger value="beta">Beta</TabsTrigger>
      </TabsList>

      <TabsContent value="alpha">
        <p class="text-sm text-muted">First panel. The active value lives in your own ref.</p>
      </TabsContent>
      <TabsContent value="beta">
        <p class="text-sm text-muted">Second panel. Set <code>padding</code> to <code>false</code> to control spacing yourself.</p>
      </TabsContent>
    </Tabs>

    <Button variant="outline" size="sm" @click="tab = tab === 'alpha' ? 'beta' : 'alpha'">
      Switch externally
    </Button>
  </div>
</template>
