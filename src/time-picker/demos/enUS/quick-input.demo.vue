<markdown>
# Quick input and inherited settings

With `quick-input`, press Enter to parse compact input. `default-to-extreme` fills missing fields using minimum or maximum values. Toggle form readonly, hidden placeholders and local overrides. Try 20261026 for dates or 0830 for times.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const hidden = ref(false)
const ignore = ref(false)
const value = ref<number | null>(null)
const extreme = ref<'min' | 'max'>('min')
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="readonly">
        Form readonly
      </n-checkbox><n-checkbox v-model:checked="hidden">
        Hide placeholders
      </n-checkbox><n-checkbox v-model:checked="ignore">
        Ignore inherited settings
      </n-checkbox>
    </n-space><n-radio-group v-model:value="extreme">
      <n-radio-button value="min">
        min
      </n-radio-button><n-radio-button value="max">
        max
      </n-radio-button>
    </n-radio-group><n-form :readonly="readonly" :hide-placeholder="hidden">
      <n-time-picker
        v-model:value="value"
        quick-input
        :default-to-extreme="extreme"
        :ignore-parent-readonly="ignore"
        :hide-placeholder="ignore ? false : undefined"
        :ignore-parent-hide-placeholder="ignore ? 'form' : undefined"
      >
        <template #prepend>
          Input
        </template><template #append>
          Press Enter
        </template>
      </n-time-picker>
    </n-form><n-text>{{ value }}</n-text>
  </n-space>
</template>
