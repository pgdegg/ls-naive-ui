<markdown>
# 确认与异步建议

确认使用 Promise 返回动作；自动补全模拟异步请求，可快速输入验证旧结果不会覆盖新结果。
</markdown>

<script setup lang="ts">
import { useDialog } from 'naive-ui'
import { ref } from 'vue'

const dialog = useDialog()
const result = ref('尚未操作')
async function confirm() {
  result.value = await dialog.confirm({
    title: '确认保存',
    content: '保存本次诊疗记录？',
    resolveOnCancel: true,
    distinguishCancelAndClose: true
  })
}
async function suggestions(query: string) {
  await new Promise(resolve =>
    setTimeout(resolve, query.length < 2 ? 500 : 100)
  )
  return [`${query} 门诊`, `${query} 住院`]
}
</script>

<template>
  <n-space vertical>
    <n-auto-complete
      :fetch-suggestions="suggestions"
      :debounce="150"
      placeholder="输入关键词"
    />
    <n-button @click="confirm">
      确认保存
    </n-button>
    <n-text>动作：{{ result }}</n-text>
  </n-space>
</template>
