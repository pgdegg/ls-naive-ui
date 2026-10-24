<markdown>
# 程序化聚焦与异步拦截

使用字段与行标识定位编辑表格中的控件，不依赖具体表格库。`enter-provider` 可以异步处理当前控件，返回 `false` 取消切换。
</markdown>

<script setup lang="ts">
import type { KeyboardInteractiveInst } from 'naive-ui'
import { ref } from 'vue'

const interactive = ref<KeyboardInteractiveInst | null>(null)
const rows = ref([
  { id: '1', name: '', note: '' },
  { id: '2', name: '', note: '' }
])
const allow = ref(true)

async function beforeEnter(): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return allow.value
}
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-button @click="interactive?.focus('first')">
        第一个
      </n-button>
      <n-button @click="interactive?.focus('last')">
        最后一个
      </n-button>
      <n-button @click="interactive?.focus({ field: 'name' }, 'next', '2')">
        第二行姓名的下一个
      </n-button>
      <n-checkbox v-model:checked="allow">
        允许 Enter 切换
      </n-checkbox>
    </n-space>
    <n-keyboard-interactive
      ref="interactive"
      :default-focus-first="false"
      :enter-provider="beforeEnter"
    >
      <n-space v-for="row in rows" :key="row.id">
        <n-keyboard-interactive-item
          path="name"
          :row-id="row.id"
          :value="row.name"
        >
          <n-input
            v-model:value="row.name"
            :placeholder="`第 ${row.id} 行姓名`"
          />
        </n-keyboard-interactive-item>
        <n-keyboard-interactive-item
          path="note"
          :row-id="row.id"
          :value="row.note"
        >
          <n-input
            v-model:value="row.note"
            :placeholder="`第 ${row.id} 行备注`"
          />
        </n-keyboard-interactive-item>
      </n-space>
    </n-keyboard-interactive>
  </n-space>
</template>
