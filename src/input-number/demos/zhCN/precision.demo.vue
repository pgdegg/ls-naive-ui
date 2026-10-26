<markdown>
# 最大精度与只读继承

`max-precision` 限制最大小数位而不补零，超出时 `on-precision-exceed` 提供原值和上限。表单只读和隐藏提示可局部豁免；上下按钮与附加内容可一起使用。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const hidden = ref(false)
const ignore = ref(false)
const value = ref<number | null>(null)
const notice = ref('')
function exceed(value: number, precision: number) {
  notice.value = `${value} → ${precision}`
}
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
    </n-space><n-form :readonly="readonly" :hide-placeholder="hidden">
      <n-input-number
        v-model:value="value"
        :max-precision="2"
        button-placement="right-vertical"
        :ignore-parent-readonly="ignore"
        :hide-placeholder="ignore ? false : undefined"
        :ignore-parent-hide-placeholder="ignore ? 'form' : undefined"
        @precision-exceed="exceed"
      >
        <template #prepend>
          ￥
        </template><template #append>
          元
        </template>
      </n-input-number>
    </n-form><n-text>{{ value }} / {{ notice }}</n-text>
  </n-space>
</template>
