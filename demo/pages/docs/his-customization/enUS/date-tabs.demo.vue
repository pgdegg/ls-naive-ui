<markdown>
# Quick dates and fixed tabs

Enter `2026/2` and press Enter in each range field. The start becomes the first day and the end becomes the last day. Fixed tabs stay outside the scrolling middle group.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const range = ref<[number, number] | null>(null)
const time = ref<string | null>(null)
</script>

<template>
  <n-space vertical>
    <n-date-picker v-model:value="range" type="daterange" quick-input clearable>
      <template #prepend>
        Visit dates
      </template>
    </n-date-picker>
    <n-time-picker
      v-model:formatted-value="time"
      quick-input
      placeholder="Enter 1230 and press Enter"
    >
      <template #append>
        Time
      </template>
    </n-time-picker>
    <n-text>Range: {{ range }}; Time: {{ time }}</n-text>
    <n-tabs
      type="card"
      left-type="card"
      right-type="line"
      style="max-width: 640px"
    >
      <template #header-left>
        <n-text style="padding: 8px">
          Visits
        </n-text>
      </template>
      <template #fixed-top>
        <n-alert :show-icon="false">
          This toolbar stays when the active tab changes
        </n-alert>
      </template>
      <template #fixed-left>
        <div style="padding: 12px">
          Patient
        </div>
      </template>
      <template #fixed-bottom>
        <n-text depth="3">
          Fixed status bar
        </n-text>
      </template>
      <n-tab-pane name="overview" tab="Overview" fixed="left">
        Patient overview
      </n-tab-pane>
      <n-tab-pane
        v-for="index in 12"
        :key="index"
        :name="index"
        :tab="`Visit record ${index}`"
      >
        Visit record {{ index }}
      </n-tab-pane>
      <n-tab-pane name="settings" tab="Settings" fixed="right">
        Pinned settings
      </n-tab-pane>
    </n-tabs>
  </n-space>
</template>
