<markdown>
# 模式、透明度与禁用

可将面板放入表单，继承 readonly；也可独立设置 disabled。内部输入与操作一起禁用。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>('rgba(64, 158, 255, 0.6)')
const alpha = ref(true)
const disabled = ref(false)
const readonly = ref(false)
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="alpha">
        显示透明度
      </n-checkbox>
      <n-checkbox v-model:checked="disabled">
        禁用
      </n-checkbox>
      <n-checkbox v-model:checked="readonly">
        表单只读
      </n-checkbox>
    </n-space>
    <n-form :readonly="readonly">
      <n-color-picker-panel
        v-model:value="value"
        :show-alpha="alpha"
        :disabled="disabled"
        show-preview
        :modes="['rgb', 'hex', 'hsl', 'hsv']"
      />
    </n-form>
    <n-text>{{ value }}</n-text>
  </n-space>
</template>
