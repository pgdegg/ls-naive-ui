<markdown>
# 字符串和数字选项

`options` 可以直接传入 `string[]` 或 `number[]`，自动将每项作为值和显示名称（数字名称转为字符串），按原始值去重并保留首次出现的顺序。数字值保持数字类型；不会修改传入的数组。支持 `label-field`、`value-field`，对象选项和分组仍按原有方式使用。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref<string | null>('门诊')
const number = ref<number | null>(0)
const texts = ['门诊', '住院', '门诊', '急诊']
const numbers = [0, 1, 2, 1, 0]
</script>

<template>
  <n-space vertical>
    <n-select v-model:value="text" :options="texts" filterable />
    <n-select v-model:value="number" :options="numbers" filterable />
    <n-text>{{ text }} / {{ number }}</n-text>
  </n-space>
</template>
