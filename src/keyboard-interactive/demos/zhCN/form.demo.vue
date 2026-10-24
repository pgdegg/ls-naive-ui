<markdown>
# 表单校验

Enter 会校验当前 `NFormItem` 的全部规则。校验失败时保留焦点，成功后继续。
</markdown>

<script setup lang="ts">
import type { FormRules } from 'naive-ui'
import { ref } from 'vue'

const model = ref({ name: '', age: null as number | null, note: '' })
const rules: FormRules = {
  name: { required: true, message: '请输入姓名', trigger: ['input', 'blur'] },
  age: {
    type: 'number',
    required: true,
    message: '请输入年龄',
    trigger: ['change', 'blur']
  }
}
</script>

<template>
  <n-keyboard-interactive :default-focus-first="false">
    <n-form
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="60"
    >
      <n-form-item label="姓名" path="name">
        <n-input
          v-model:value="model.name"
          placeholder="留空按 Enter 查看校验"
        />
      </n-form-item>
      <n-form-item label="年龄" path="age">
        <n-keyboard-interactive-item :value="model.age">
          <n-input-number v-model:value="model.age" :show-button="false" />
        </n-keyboard-interactive-item>
      </n-form-item>
      <n-form-item label="备注" path="note">
        <n-input v-model:value="model.note" />
      </n-form-item>
    </n-form>
  </n-keyboard-interactive>
</template>
