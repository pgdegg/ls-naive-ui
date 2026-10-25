<markdown>
# 标签图标与固定分组

`icon` 可传入 sprite 名称或渲染函数，`icon` 插槽可放任意图标组件；插槽优先于属性。普通标签、固定标签和不带面板的 `n-tab` 都支持图标。字符串图标使用 `n-icon`，尚未加载时显示内置占位。
</markdown>

<script setup lang="ts">
import { HomeOutline } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { h } from 'vue'

const homeIcon = () => h(NIcon, null, { default: () => h(HomeOutline) })
</script>

<template>
  <n-space vertical>
    <n-tabs type="card" default-value="home">
      <n-tab-pane name="home" tab="总览" fixed="left" :icon="homeIcon">
        总览内容
      </n-tab-pane>
      <n-tab-pane name="records" tab="诊疗记录">
        <template #icon>
          <NIcon :component="HomeOutline" />
        </template>
        诊疗记录内容
      </n-tab-pane>
      <n-tab-pane name="sprite" tab="动态图标" fixed="right" icon="his-record">
        应用插入 icon-his-record symbol 后会自动替换占位图标。
      </n-tab-pane>
    </n-tabs>
    <n-tabs default-value="only-tab">
      <n-tab name="only-tab" :icon="homeIcon">
        仅标签
      </n-tab>
      <n-tab name="slot-tab">
        <template #icon>
          <NIcon :component="HomeOutline" />
        </template>
        插槽图标
      </n-tab>
    </n-tabs>
  </n-space>
</template>
