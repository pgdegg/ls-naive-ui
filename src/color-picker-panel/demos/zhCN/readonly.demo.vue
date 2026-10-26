<markdown>
# 只读继承与局部覆盖

表单 readonly 禁止编辑面板，ignore-parent-readonly 允许局部跳过继承；组件自身 readonly 或禁用状态仍然有效。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const ignore = ref(false)
const value = ref<string | null>('#18a058')
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="readonly">
        readonly
      </n-checkbox><n-checkbox v-model:checked="ignore">
        ignore-parent-readonly
      </n-checkbox>
    </n-space><n-form :readonly="readonly">
      <n-color-picker-panel
        v-model:value="value"
        :readonly="readonly && !ignore"
        :ignore-parent-readonly="ignore"
        style="width: 300px"
      />
    </n-form>
  </n-space>
</template>
