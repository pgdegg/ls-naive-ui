<markdown>
# 基础用法

按 Enter 前往下一个控件。已有值、禁用和只读控件会自动跳过。多行输入框保留 Enter 换行。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const preset = ref('已有值')
const remark = ref('')
const loop = ref(true)
</script>

<template>
  <n-space vertical>
    <n-switch v-model:value="loop">
      <template #checked>
        循环聚焦
      </template>
      <template #unchecked>
        不循环
      </template>
    </n-switch>
    <n-keyboard-interactive :loop-focus="loop" :default-focus-first="false">
      <n-space vertical>
        <n-input v-model:value="name" placeholder="姓名：按 Enter 继续" />
        <n-input v-model:value="preset" placeholder="已有值，会被跳过" />
        <n-input disabled placeholder="禁用，会被跳过" />
        <n-input readonly value="只读，会被跳过" />
        <n-input v-model:value="remark" placeholder="备注：按 Enter 回到开头" />
      </n-space>
    </n-keyboard-interactive>
  </n-space>
</template>
