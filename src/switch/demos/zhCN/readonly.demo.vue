<markdown>
# 只读继承与局部覆盖

对比继承表单 readonly 与 ignore-parent-readonly 局部豁免。组件自身 readonly 仍然生效。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const ignore = ref(false)
const value = ref(false)
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="readonly">
        readonly
      </n-checkbox><n-checkbox v-model:checked="ignore">
        ignore-parent-readonly
      </n-checkbox>
    </n-space><n-form :readonly="readonly">
      <n-space>
        <n-switch v-model:value="value" /><n-switch
          v-model:value="value"
          :readonly="readonly && !ignore"
          :ignore-parent-readonly="ignore"
        />
      </n-space>
    </n-form>
  </n-space>
</template>
