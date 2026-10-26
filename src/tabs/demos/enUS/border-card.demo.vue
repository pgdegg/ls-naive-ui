<markdown>
# Bordered card

`type="border-card"` encloses the header and content in one border, with a muted header and an active tab connected to the panel. Supports all placements, close/add actions, disabled tabs, icons and fixed groups. Switch themes to inspect dark colors. `left-type` / `right-type` configure fixed groups; surrounding content slots persist across panes.
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
        Dark
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
            Records
          </n-text>
        </template>
        <template #fixed-top>
          <n-text style="padding: 8px">
            Fixed tools
          </n-text>
        </template>
        <template #fixed-bottom>
          <n-text depth="3" style="padding: 8px">
            {{ active }}
          </n-text>
        </template>
        <n-tab-pane name="fixed" tab="Overview" fixed="left" :closable="false">
          <template #icon>
            ▦
          </template>Fixed pane content
        </n-tab-pane>
        <n-tab-pane v-for="name in panes" :key="name" :name="name" :tab="name">
          <template #icon>
            ▤
          </template>Current pane: {{ name }}
        </n-tab-pane>
        <n-tab-pane name="disabled" tab="Disabled" disabled />
        <n-tab-pane
          name="help"
          tab="Help"
          fixed="right"
          icon="help"
          :closable="false"
        >
          A fixed tab on the right
        </n-tab-pane>
      </n-tabs>
    </n-config-provider>
  </n-space>
</template>
