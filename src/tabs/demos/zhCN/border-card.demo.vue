<markdown>
# 带边框的卡片

`type="border-card"` 将标签头和内容放在同一个边框内，灰色标签头、选中项与内容背景相连。支持四个位置、关闭、新增、禁用、图标以及左右固定分组；切换暗色主题可观察配色。`left-type` / `right-type` 可独立选择固定分组样式，内容区周边插槽保持显示。
</markdown>

<script setup lang="ts">
import type { TabsProps } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { ref } from 'vue'

const dark = ref(false)
const placement = ref<NonNullable<TabsProps['placement']>>('top')
const active = ref<string | number>('first')
const panes = ref(['first', 'second'])
let count = 2
function add() {
  const name = `tab-${++count}`
  panes.value.push(name)
  active.value = name
}
function close(name: string | number) {
  panes.value = panes.value.filter(item => item !== name)
  if (active.value === name)
    active.value = panes.value[0] ?? 'fixed'
}
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="dark">
        暗色
      </n-checkbox><n-radio-group v-model:value="placement">
        <n-radio-button
          v-for="item in ['top', 'bottom', 'left', 'right']"
          :key="item"
          :value="item"
        >
          {{ item }}
        </n-radio-button>
      </n-radio-group>
    </n-space>
    <n-config-provider :theme="dark ? darkTheme : null">
      <n-tabs
        v-model:value="active"
        type="border-card"
        :placement="placement"
        left-type="border-card"
        right-type="border-card"
        addable
        closable
        @add="add"
        @close="close"
      >
        <template #header-left>
          <n-text style="padding: 0 8px">
            病历
          </n-text>
        </template>
        <template #fixed-top>
          <n-text style="padding: 8px">
            固定工具区
          </n-text>
        </template>
        <template #fixed-bottom>
          <n-text depth="3" style="padding: 8px">
            {{ active }}
          </n-text>
        </template>
        <n-tab-pane name="fixed" tab="概览" fixed="left" :closable="false">
          <template #icon>
            ▦
          </template>固定页签内容
        </n-tab-pane>
        <n-tab-pane v-for="name in panes" :key="name" :name="name" :tab="name">
          <template #icon>
            ▤
          </template>当前页签: {{ name }}
        </n-tab-pane>
        <n-tab-pane name="disabled" tab="禁用" disabled />
        <n-tab-pane
          name="help"
          tab="帮助"
          fixed="right"
          icon="help"
          :closable="false"
        >
          固定在右侧的标签
        </n-tab-pane>
      </n-tabs>
    </n-config-provider>
  </n-space>
</template>
