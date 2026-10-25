<markdown>
# 只读表单与附加内容

切换表单只读和提示隐藏，观察局部豁免、数字精度与输入字符限制。
</markdown>

<script setup lang="ts">
import { hisThemeOverrides } from 'naive-ui'
import { ref } from 'vue'

const readonly = ref(false)
const hide = ref(false)
const value = ref('')
const number = ref<number | null>(1.23)
</script>

<template>
  <n-config-provider :theme-overrides="hisThemeOverrides">
    <n-space vertical>
      <n-space>
        <n-checkbox v-model:checked="readonly">
          表单只读
        </n-checkbox>
        <n-checkbox v-model:checked="hide">
          隐藏提示
        </n-checkbox>
      </n-space>
      <n-form
        :readonly="readonly"
        :hide-placeholder="hide"
        :content-width="320"
        label-placement="left"
        label-width="80"
      >
        <n-form-item label="编码">
          <n-input
            v-model:value="value"
            keeps="a-zA-Z0-9"
            ignorekeeps="-"
            placeholder="仅允许字母数字和连字符"
          >
            <template #prepend>
              HIS
            </template>
            <template #append>
              编码
            </template>
          </n-input>
        </n-form-item>
        <n-form-item label="数量">
          <n-input-number v-model:value="number" :max-precision="2">
            <template #append>
              盒
            </template>
          </n-input-number>
        </n-form-item>
        <n-form-item label="豁免">
          <n-input
            ignore-parent-readonly
            :hide-placeholder="false"
            placeholder="始终可编辑"
          />
        </n-form-item>
      </n-form>
      <n-card :disabled="readonly" size="small" title="卡片禁用上下文">
        <n-button-group ghost :disabled="readonly">
          <n-button>继承禁用</n-button>
          <n-button> 同样继承禁用 </n-button>
        </n-button-group>
      </n-card>
    </n-space>
  </n-config-provider>
</template>
