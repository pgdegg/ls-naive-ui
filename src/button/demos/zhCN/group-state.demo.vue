<markdown>
# 按钮组继承

组级 `disabled`、`ghost`、`text` 向按钮传递；子按钮 disabled=false 不能解除组禁用。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(false)
const ghost = ref(false)
const text = ref(false)
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="disabled">
        disabled
      </n-checkbox><n-checkbox v-model:checked="ghost">
        ghost
      </n-checkbox><n-checkbox v-model:checked="text">
        text
      </n-checkbox>
    </n-space><n-button-group :disabled="disabled" :ghost="ghost" :text="text">
      <n-button type="primary">
        保存
      </n-button><n-button :disabled="false">
        子按钮
      </n-button>
    </n-button-group>
  </n-space>
</template>
