<markdown>
# 内容高度与拖拽复位

height 限制内容区高度并允许滚动。useDialog.create 同样接受 height 和 resetOnResize；打开后拖动并调整窗口尺寸验证复位。
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
      title="固定内容高度"
      :height="height"
      :closable="false"
    >
      <p v-for="index in 10" :key="index">
        内容 {{ index }}
      </p>
    </n-dialog><n-button @click="open">
      打开可拖拽对话框
    </n-button>
  </n-space>
</template>
