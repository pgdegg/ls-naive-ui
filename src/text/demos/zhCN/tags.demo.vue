<markdown>
# 标签、图标和事件

使用语义标签，或混合内联图标与组件。事件直接使用原生监听。
</markdown>

<script setup lang="ts">
import { HomeOutline } from '@vicons/ionicons5'
import { ref } from 'vue'

const clicks = ref(0)
</script>

<template>
  <n-space vertical>
    <n-text tag="p">
      段落内容
    </n-text>
    <n-text tag="mark">
      标记文本
    </n-text>
    <n-text>
      H<n-text tag="sub" size="small">
        2
      </n-text>O；x<n-text
        tag="sup"
        size="small"
      >
        2
      </n-text>
    </n-text>
    <n-text>
      <n-icon :component="HomeOutline" /> 首页
      <n-button text type="primary" @click="clicks++">
        操作按钮
      </n-button>
    </n-text>
    <n-text
      tag="button"
      type="primary"
      style="border: 0; background: none; padding: 0; cursor: pointer"
      @click="clicks++"
    >
      点击文本：{{ clicks }}
    </n-text>
  </n-space>
</template>
