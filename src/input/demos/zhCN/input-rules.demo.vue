<markdown>
# 输入规则与表单继承

切换表单只读/隐藏提示及局部豁免。`keeps` 保留数字，`ignorekeeps` 额外允许小数点；点击按钮挂载带 `autofocus` / `focus-delay` 的输入框，观察延迟聚焦。前后附加内容位于边框外。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const hidden = ref(false)
const ignore = ref(false)
const value = ref<string | null>(null)
const focus = ref(false)
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
    </n-space>
    <n-form :readonly="readonly" :hide-placeholder="hidden">
      <n-input
        v-model:value="value"
        keeps="0-9"
        :ignorekeeps="['.']"
        :ignore-parent-readonly="ignore"
        :hide-placeholder="ignore ? false : undefined"
        :ignore-parent-hide-placeholder="ignore ? 'form' : undefined"
        placeholder="输入数字和小数点"
      >
        <template #prepend>
          ￥
        </template><template #append>
          元
        </template>
      </n-input>
    </n-form>
    <n-button @click="focus = !focus">
      挂载 / 移除延迟聚焦输入框
    </n-button>
    <n-input
      v-if="focus"
      autofocus
      :focus-delay="500"
      :keeps="[/[a-z]/, '0-9']"
      placeholder="a-z / 0-9"
    />
    <n-text>{{ value }}</n-text>
  </n-space>
</template>
