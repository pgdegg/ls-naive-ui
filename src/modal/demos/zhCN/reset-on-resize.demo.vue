<markdown>
# 窗口变化后复位

打开可拖拽弹窗，拖动后调整浏览器窗口尺寸；reset-on-resize 开启时会防抖恢复初始位移。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
const reset = ref(true)
</script>

<template>
  <n-space>
    <n-checkbox v-model:checked="reset">
      reset-on-resize
    </n-checkbox><n-button @click="show = true">
      打开弹窗
    </n-button><n-modal
      v-model:show="show"
      preset="dialog"
      draggable
      :reset-on-resize="reset"
      title="拖动后调整窗口"
    >
      将窗口缩小或放大观察位置复位。
    </n-modal>
  </n-space>
</template>
