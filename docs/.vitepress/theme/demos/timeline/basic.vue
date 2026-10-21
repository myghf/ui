<script setup lang="ts">
import { Timeline, TimelineItem } from '@myghf/ui'
</script>

<template>
  <div class="max-w-md">
    <Timeline label="Admission">
      <TimelineItem title="Admitted" time="09:15" tone="success">Triage complete.</TimelineItem>
      <TimelineItem title="Transferred to ward" time="11:40">Bed 12 assigned.</TimelineItem>
      <TimelineItem title="Scheduled for discharge" time="15:05">Paperwork pending.</TimelineItem>
    </Timeline>
  </div>
</template>
