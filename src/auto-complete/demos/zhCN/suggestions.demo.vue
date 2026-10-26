<markdown>
# 异步建议与配置

调整 `debounce`、`trigger-on-focus`、`offset`，快速输入可验证过期请求不会覆盖新结果。`fetch-suggestions` 返回 Promise，也可以调用 callback。复用表单只读、提示与局部覆盖配置。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const hidden = ref(false)
const ignore = ref(false)
const value = ref<string | null>(null)
const debounce = ref(200)
const trigger = ref(true)
const offset = ref(8)
async function suggestions(query: string) {
  await new Promise(resolve =>
    setTimeout(resolve, query.length < 2 ? 500 : 100)
  )
  return [`${query} Alpha`, `${query} Beta`]
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
    </n-space><n-space>
      <n-checkbox v-model:checked="trigger">
        trigger-on-focus
      </n-checkbox><n-input-number
        v-model:value="debounce"
        :min="0"
        :step="100"
      /><n-input-number v-model:value="offset" :min="0" />
    </n-space><n-form :readonly="readonly" :hide-placeholder="hidden">
      <n-auto-complete
        v-model:value="value"
        :fetch-suggestions="suggestions"
        :debounce="debounce"
        :trigger-on-focus="trigger"
        :offset="offset"
        :ignore-parent-readonly="ignore"
        :hide-placeholder="ignore ? false : undefined"
        :ignore-parent-hide-placeholder="ignore ? 'form' : undefined"
      />
    </n-form>
  </n-space>
</template>
