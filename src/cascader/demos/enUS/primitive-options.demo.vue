<markdown>
# String and number options

Pass `string[]` or `number[]` directly to `options` to create root-level leaf options. Values keep their original type and labels use the corresponding text. Duplicates are removed in first-occurrence order without changing the source array. Custom `label-field` and `value-field` are supported. Use `CascaderOption[]` for nested options.
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
    <n-cascader v-model:value="text" :options="texts" filterable />
    <n-cascader v-model:value="number" :options="numbers" filterable />
    <n-text>{{ text }} / {{ number }}</n-text>
  </n-space>
</template>
