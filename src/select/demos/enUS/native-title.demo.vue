<markdown>
# 完整内容提示

悬停控件即可通过原生 title 查看完整标签。开启 show-value-in-title 后，提示同时显示 value 和「label」；控件内仍显示标签。多选提示包含所有折叠项。
</markdown>

<script lang="ts" setup>
import { ref } from 'vue'

const showValue = ref(false)
const options = [
  { label: '这是一段超出控件宽度的完整标签内容', value: 'A001' },
  { label: '第二个选项的完整标签内容', value: 'A002' }
]
const treeOptions = [
  {
    label: '父级的完整标签',
    value: 'parent',
    key: 'parent',
    children: [{ label: '子级的完整标签', value: 'child', key: 'child' }]
  }
]
</script>

<template>
  <n-space vertical>
    <n-checkbox v-model:checked="showValue">
      在 title 中同时展示 value 和「label」
    </n-checkbox>
    <n-select
      style="width: 200px"
      default-value="A001"
      :options="options"
      :show-value-in-title="showValue"
    />
    <n-select
      style="width: 200px"
      multiple
      :max-tag-count="1"
      :default-value="['A001', 'A002']"
      :options="options"
      :show-value-in-title="showValue"
    />
    <n-cascader
      style="width: 200px"
      default-value="child"
      :options="treeOptions"
      :show-value-in-title="showValue"
    />
    <n-tree-select
      style="width: 200px"
      default-value="child"
      show-path
      :options="treeOptions"
      :show-value-in-title="showValue"
    />
    <n-input
      style="width: 200px"
      default-value="这是一段超出输入框宽度的完整文本内容"
    />
  </n-space>
</template>
