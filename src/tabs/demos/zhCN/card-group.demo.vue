<markdown>
# 连体卡片与关闭按钮

`type="card-group"` 将标签连接为一组边框，选中标签底边与内容区连通，类似 Element Plus 的 card。切换 type 可对比原有独立卡片 card 和整体带边框的 border-card。关闭按钮默认在移入标签时展开；close-button-display="always" 常驻。TabPane/Tab 同名属性可覆盖组设置，键盘聚焦及无悬停能力设备同样能访问关闭按钮。
</markdown>

<script setup lang="ts">
import type { TabsProps } from 'naive-ui'
import { ref } from 'vue'

const type = ref<NonNullable<TabsProps['type']>>('card-group')
const active = ref<string | number>('User')
const always = ref(false)
const pinned = ref(false)
const panes = ref(['User', 'Config', 'Role', 'Task'])
function close(name: string | number) {
  const index = panes.value.indexOf(String(name))
  panes.value = panes.value.filter(item => item !== name)
  if (active.value === name)
    active.value = panes.value[Math.max(0, index - 1)] ?? ''
}
function reset() {
  panes.value = ['User', 'Config', 'Role', 'Task']
  active.value = 'User'
}
</script>

<template>
  <n-space vertical>
    <n-radio-group v-model:value="type">
      <n-radio-button value="card">
        card
      </n-radio-button><n-radio-button value="card-group">
        card-group
      </n-radio-button><n-radio-button value="border-card">
        border-card
      </n-radio-button>
    </n-radio-group>
    <n-space>
      <n-checkbox v-model:checked="always">
        关闭按钮常驻
      </n-checkbox><n-checkbox v-model:checked="pinned">
        仅 Config 常驻
      </n-checkbox><n-button size="small" @click="reset">
        恢复标签
      </n-button>
    </n-space>
    <n-tabs
      v-model:value="active"
      :type="type"
      closable
      :close-button-display="always ? 'always' : 'hover'"
      @close="close"
    >
      <n-tab-pane
        v-for="name in panes"
        :key="name"
        :name="name"
        :tab="name"
        :close-button-display="
          name === 'Config' && pinned ? 'always' : undefined
        "
      >
        {{ name }}
      </n-tab-pane>
    </n-tabs>
  </n-space>
</template>
