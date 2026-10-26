<markdown>
# 可增加

增加一些标签页，适用于 `card`、`card-group` 和 `border-card`。关闭按钮移出时释放宽度；标签默认按内容宽度排列，不设置额外的最小宽度。
</markdown>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const valueRef = ref(1)
const panelsRef = ref([1, 2, 3, 4, 5])
const addableRef = computed(() => {
  return {
    disabled: panelsRef.value.length >= 10
  }
})
const closableRef = computed(() => {
  return panelsRef.value.length > 1
})

const value = valueRef
const panels = panelsRef
const addable = addableRef
const closable = closableRef

function handleAdd() {
  const newValue = Math.max(...panelsRef.value) + 1
  panelsRef.value.push(newValue)
  valueRef.value = newValue
}

function handleClose(name: number) {
  const { value: panels } = panelsRef
  const nameIndex = panels.findIndex(panelName => panelName === name)
  if (!~nameIndex)
    return
  panels.splice(nameIndex, 1)
  if (name === valueRef.value) {
    valueRef.value = panels[Math.min(nameIndex, panels.length - 1)]
  }
}
</script>

<template>
  <n-tabs
    v-model:value="value"
    type="card"
    :addable="addable"
    :closable="closable"
    @close="handleClose"
    @add="handleAdd"
  >
    <n-tab-pane v-for="panel in panels" :key="panel" :name="panel">
      {{ panel }}
    </n-tab-pane>
    <template #prefix>
      Prefix
    </template>
    <template #suffix>
      Suffix
    </template>
  </n-tabs>
</template>
