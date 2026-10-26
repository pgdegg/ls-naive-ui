<markdown>
# Independent scrollbar thickness

Adjust overflow-width (vertical width) and overflow-height (horizontal height), in pixels. Long content exposes both scrollbars.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const width = ref(8)
const height = ref(8)
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-input-number v-model:value="width" :min="2" :max="20" /><n-input-number
        v-model:value="height"
        :min="2"
        :max="20"
      />
    </n-space><n-scrollbar
      :overflow-width="width"
      :overflow-height="height"
      x-scrollable
      trigger="none"
      style="max-height: 120px"
    >
      <div style="width: 1000px; height: 240px; padding: 12px">
        Scroll both ways to compare scrollbar thickness
      </div>
    </n-scrollbar>
  </n-space>
</template>
