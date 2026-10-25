<markdown>
# 字符串和数字选项

`options` 可以直接传入 `string[]` 或 `number[]`，每项生成一个一级叶子选项，值保持原始类型，名称为对应文本。重复项按原始值去重，保留首次出现的顺序，不修改原数组。支持 `label-field`、`value-field`；多级结构继续使用 `CascaderOption[]`。
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
    <n-cascader v-model:value="text" :options="texts" filterable />
    <n-cascader v-model:value="number" :options="numbers" filterable />
    <n-text>{{ text }} / {{ number }}</n-text>
  </n-space>
</template>
