<markdown>
# 右侧上下按钮

设置 `button-placement="right-vertical"`，在右侧将增加和减少按钮上下排列，类似 Element Plus。上箭头增加，下箭头减少；支持长按、键盘、范围限制以及已有的图标插槽。

按钮区使用透明背景与细分隔线，宽度随输入框尺寸调整，箭头统一为 12px；支持亮色和暗色主题。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<number | null>(1)
const disabled = ref(false)
const readonly = ref(false)
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="disabled">
        禁用
      </n-checkbox>
      <n-checkbox v-model:checked="readonly">
        只读
      </n-checkbox>
    </n-space>
    <n-input-number
      v-for="size in ['tiny', 'small', 'medium', 'large'] as const"
      :key="size"
      v-model:value="value"
      :size="size"
      :min="0"
      :max="10"
      :disabled="disabled"
      :readonly="readonly"
      button-placement="right-vertical"
      style="width: 180px"
    />
    <n-input-number
      v-model:value="value"
      :min="0"
      :max="10"
      :disabled="disabled"
      :readonly="readonly"
      button-placement="right-vertical"
      clearable
    >
      <template #suffix>
        数量
      </template>
      <template #append>
        盒
      </template>
    </n-input-number>
    <n-text>当前值：{{ value }}（0–10）</n-text>
  </n-space>
</template>
