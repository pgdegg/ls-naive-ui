<markdown>
# Using it in a form

`n-dynamic-input` itself cannot be verified. If you need to verify the input of `n-dynamic-input`, you can pass `n-form-item` in the custom content to complete the verification. Here is a complete example.
</markdown>

<script lang="ts" setup>
import { ref } from 'vue'

const dynamicInputRule = {
  trigger: 'input',
  validator(rule: unknown, value: string) {
    if (value.length >= 5)
      return new Error('Input up to 4 characters')
    return true
  }
}

const model = ref({
  dynamicInputValue: [{ value: '', name: '' }]
})

function onCreate() {
  return {
    name: '',
    value: ''
  }
}
</script>

<template>
  <n-form :model="model">
    <n-dynamic-input
      v-model:value="model.dynamicInputValue"
      item-style="margin-bottom: 0;"
      :on-create="onCreate"
      #="{ index }"
    >
      <div style="display: flex">
        <!--
          通常，path 的变化会导致 form-item 的验证内容
          或规则发生变化，因此 naive-ui 会清除已有的
          验证效果。但本示例属于特殊情况：我们明确知道
          path 的变化不会改变 form-item 的验证结果和
          规则，因此在 form-item 上设置 ignore-path-change
        -->
        <n-form-item
          ignore-path-change
          :show-label="false"
          :path="`dynamicInputValue[${index}].name`"
          :rule="dynamicInputRule"
        >
          <n-input
            v-model:value="model.dynamicInputValue[index].name"
            placeholder="Name"
            @keydown.enter.prevent
          />
          <!--
           由于在 input 元素中按回车会触发表单内的 button 被点击，因此阻止了默认行为
          -->
        </n-form-item>
        <div style="height: 34px; line-height: 34px; margin: 0 8px">
          =
        </div>
        <n-form-item
          ignore-path-change
          :show-label="false"
          :path="`dynamicInputValue[${index}].value`"
          :rule="dynamicInputRule"
        >
          <n-input
            v-model:value="model.dynamicInputValue[index].value"
            placeholder="Value"
            @keydown.enter.prevent
          />
        </n-form-item>
      </div>
    </n-dynamic-input>
  </n-form>
  <pre>{{ JSON.stringify(model.dynamicInputValue, null, 2) }}</pre>
</template>
