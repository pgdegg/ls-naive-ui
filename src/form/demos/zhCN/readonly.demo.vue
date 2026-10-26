<markdown>
# 只读、提示与内容宽度

`readonly` 和 `hide-placeholder` 向子控件传递，`content-width` 设置 inline 表单项内容宽度；第二个控件显式跳过继承。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const hidden = ref(false)
const ignore = ref(false)
const value = ref<string | null>(null)
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
    </n-space><n-form
      inline
      :readonly="readonly"
      :hide-placeholder="hidden"
      :content-width="180"
    >
      <n-form-item label="继承">
        <n-input v-model:value="value" />
      </n-form-item><n-form-item label="局部配置">
        <n-input
          v-model:value="value"
          :ignore-parent-readonly="ignore"
          :hide-placeholder="ignore ? false : undefined"
          :ignore-parent-hide-placeholder="ignore ? 'form' : undefined"
        />
      </n-form-item>
    </n-form>
  </n-space>
</template>
