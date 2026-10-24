<markdown>
# Form validation

Enter validates all rules on the current NFormItem. Invalid fields retain focus.
</markdown>

<script setup lang="ts">
import type { FormRules } from 'naive-ui'
import { ref } from 'vue'

const model = ref({ name: '', age: null as number | null, note: '' })
const rules: FormRules = {
  name: {
    required: true,
    message: 'Name is required',
    trigger: ['input', 'blur']
  },
  age: {
    type: 'number',
    required: true,
    message: 'Age is required',
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
      label-width="80"
    >
      <n-form-item label="Name" path="name">
        <n-input
          v-model:value="model.name"
          placeholder="Leave empty and press Enter to validate"
        />
      </n-form-item>
      <n-form-item label="Age" path="age">
        <n-keyboard-interactive-item :value="model.age">
          <n-input-number v-model:value="model.age" :show-button="false" />
        </n-keyboard-interactive-item>
      </n-form-item>
      <n-form-item label="Note" path="note">
        <n-input v-model:value="model.note" />
      </n-form-item>
    </n-form>
  </n-keyboard-interactive>
</template>
