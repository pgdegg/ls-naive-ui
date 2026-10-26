<markdown>
# 快捷录入与继承设置

启用 `quick-input` 后按 Enter 解析简写；用 `default-to-extreme` 切换缺失字段补最小值或最大值。可切换表单只读、隐藏提示与局部豁免。日期示例可输入 20261026，时间示例可输入 0830。
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
        表单只读
      </n-checkbox><n-checkbox v-model:checked="hidden">
        隐藏提示
      </n-checkbox><n-checkbox v-model:checked="ignore">
        忽略表单只读和提示隐藏
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
          录入
        </template><template #append>
          按 Enter
        </template>
      </n-time-picker>
    </n-form><n-text>{{ value }}</n-text>
  </n-space>
</template>
