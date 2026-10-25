<markdown>
# 搜索、分隔模型与对象适配

下拉框支持拼音字段搜索、分隔字符串和标签同步；全选保留已禁用的选项。
</markdown>

<script setup lang="ts">
import type { CheckboxGroupInst } from 'naive-ui'
import { createOptionModelAdapter } from 'naive-ui'
import { computed, ref } from 'vue'

const options = [
  { value: 'a', label: '门诊', pinyin: 'menzhen' },
  { value: 'b', label: '住院', pinyin: 'zhuyuan' }
]
const value = ref('a')
const labels = ref<string | string[]>('')
const query = ref('')
const group = ref<CheckboxGroupInst | null>(null)
const checked = ref<Array<string | number>>(['locked'])
const groupOptions = [
  { value: 'locked', label: '已锁定', disabled: true },
  ...options
]
const objects = ref<unknown>([options[0]])
const adapter = createOptionModelAdapter(() => ({
  options,
  valueKey: 'value',
  multiple: true
}))
const primitive = computed({
  get: () => adapter.decode(objects.value) as string[],
  set: (value) => {
    objects.value = adapter.encode(value)
  }
})
</script>

<template>
  <n-space vertical>
    <n-select
      v-model:value="value"
      v-model:filter-value="query"
      multiple
      filterable
      separator=","
      :filter-keys="['pinyin']"
      :options="options"
      @update:label="labels = $event"
    />
    <n-text>字符串：{{ value }}；标签：{{ labels }}；搜索：{{ query }}</n-text>
    <n-select v-model:value="primitive" multiple :options="options" />
    <n-text>对象模型：{{ JSON.stringify(objects) }}</n-text>
    <n-checkbox-group
      ref="group"
      v-model:value="checked"
      :options="groupOptions"
    />
    <n-button @click="group?.toggleAll()">
      切换全选
    </n-button>
    <n-text>已选：{{ checked }}</n-text>
  </n-space>
</template>
