<markdown>
# 导航行为与校验回调

切换 disabled、loop-focus、skip-when-has-value 和 stop-when-invalid，对比 Enter 导航。第一个控件使用 validate；enter-provider 异步拦截，on-enter / on-last-blur 显示事件。default-focus-first=false 避免演示加载时抢焦点。
</markdown>

<script setup lang="ts">
import type { KeyboardInteractiveEnterContext } from 'naive-ui'
import { ref } from 'vue'

const disabled = ref(false)
const loop = ref(false)
const skip = ref(true)
const stop = ref(true)
const allow = ref(true)
const first = ref('')
const second = ref('Beta')
const notice = ref('')
async function validate() {
  return first.value.length >= 2
}
async function beforeEnter() {
  await new Promise(resolve => setTimeout(resolve, 100))
  return allow.value
}
function entered(context: KeyboardInteractiveEnterContext) {
  notice.value = `enter: ${context.current.tagName}`
}
function lastBlur() {
  notice.value = 'last-blur'
}
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="disabled">
        disabled
      </n-checkbox><n-checkbox v-model:checked="loop">
        loop-focus
      </n-checkbox><n-checkbox v-model:checked="skip">
        skip-when-has-value
      </n-checkbox><n-checkbox v-model:checked="stop">
        stop-when-invalid
      </n-checkbox><n-checkbox v-model:checked="allow">
        enter-provider: allow
      </n-checkbox>
    </n-space>
    <n-keyboard-interactive
      :disabled="disabled"
      :default-focus-first="false"
      :loop-focus="loop"
      :skip-when-has-value="skip"
      :stop-when-invalid="stop"
      :enter-provider="beforeEnter"
      @enter="entered"
      @last-blur="lastBlur"
    >
      <n-space vertical>
        <n-keyboard-interactive-item
          :order="1"
          path="first"
          row-id="row-1"
          :value="first"
          :validate="validate"
        >
          <n-input
            v-model:value="first"
            placeholder="至少输入两个字符后按 Enter"
          />
        </n-keyboard-interactive-item>
        <n-keyboard-interactive-item
          :order="2"
          path="second"
          row-id="row-1"
          :value="second"
        >
          <n-input v-model:value="second" />
        </n-keyboard-interactive-item>
        <n-keyboard-interactive-item ignore>
          <n-input placeholder="忽略 Enter 导航" />
        </n-keyboard-interactive-item>
      </n-space>
    </n-keyboard-interactive>
    <n-text>{{ notice }}</n-text>
  </n-space>
</template>
