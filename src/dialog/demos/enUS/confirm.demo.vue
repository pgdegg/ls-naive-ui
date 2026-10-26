<markdown>
# Confirmation and async suggestions

Confirmation returns an action through a Promise. Type quickly to verify that stale suggestions do not replace the latest result.
</markdown>

<script setup lang="ts">
import { useDialog } from 'naive-ui'
import { ref } from 'vue'

const dialog = useDialog()
const result = ref('No action yet')
async function confirm() {
  result.value = await dialog.confirm({
    title: 'Confirm save',
    content: 'Save this visit record?',
    resolveOnCancel: true,
    distinguishCancelAndClose: true
  })
}
async function suggestions(query: string) {
  await new Promise(resolve =>
    setTimeout(resolve, query.length < 2 ? 500 : 100)
  )
  return [`${query} Outpatient`, `${query} Inpatient`]
}
</script>

<template>
  <n-space vertical>
    <n-auto-complete
      :fetch-suggestions="suggestions"
      :debounce="150"
      placeholder="Enter a query"
    />
    <n-button @click="confirm">
      Confirm save
    </n-button>
    <n-text>Action: {{ result }}</n-text>
  </n-space>
</template>
