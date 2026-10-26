<markdown>
# 文件大小与类型校验

此示例不发起网络上传。max-size 以字节限制单个文件，validate-accept 根据 accept 检查类型，on-validation-error 显示失败原因和文件名。可分别选择大文件和非 txt 文件测试。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const error = ref('')
function invalid(reason: 'size' | 'type', file: File) {
  error.value = `${reason}: ${file.name}`
}
</script>

<template>
  <n-space vertical>
    <n-upload
      :max-size="1024"
      validate-accept
      accept=".txt"
      :default-upload="false"
      @validation-error="invalid"
    >
      <n-button>选择 txt 文件（最多 1KB）</n-button>
    </n-upload><n-text type="error">
      {{ error }}
    </n-text>
  </n-space>
</template>
