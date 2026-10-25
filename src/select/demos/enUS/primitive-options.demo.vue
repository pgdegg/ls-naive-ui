<markdown>
# String and number options

Pass `string[]` or `number[]` directly to `options`. Each item becomes its value and label (numeric labels are converted to strings). Duplicate values are removed in first-occurrence order without changing the source array. Numeric values remain numbers. Custom `label-field` and `value-field` are supported; object and group options keep their existing behavior.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref<string | null>('Outpatient')
const number = ref<number | null>(0)
const texts = ['Outpatient', 'Inpatient', 'Outpatient', 'Emergency']
const numbers = [0, 1, 2, 1, 0]
</script>

<template>
  <n-space vertical>
    <n-select v-model:value="text" :options="texts" filterable />
    <n-select v-model:value="number" :options="numbers" filterable />
    <n-text>{{ text }} / {{ number }}</n-text>
  </n-space>
</template>
