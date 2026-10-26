<markdown>
# Content height and drag reset

height constrains the scrollable content area. useDialog.create also accepts height and resetOnResize; open, drag and resize the window to verify resetting.
</markdown>

<script setup lang="ts">
import { useDialog } from 'naive-ui'
import { ref } from 'vue'

const dialog = useDialog()
const height = ref(120)
function open() {
  dialog.create({
    title: 'Dialog',
    content: 'Scrollable content. '.repeat(100),
    height: height.value,
    draggable: true,
    resetOnResize: true
  })
}
</script>

<template>
  <n-space vertical>
    <n-input-number v-model:value="height" :min="60" :step="20" /><n-dialog
      title="Fixed content height"
      :height="height"
      :closable="false"
    >
      <p v-for="index in 10" :key="index">
        Content {{ index }}
      </p>
    </n-dialog><n-button @click="open">
      Open draggable dialog
    </n-button>
  </n-space>
</template>
