<markdown>
# 基础与样式

主题色与现有排印属性可以组合使用。
</markdown>

<template>
  <n-space vertical>
    <n-space>
      <n-text
        v-for="type in [
          'default',
          'primary',
          'success',
          'info',
          'warning',
          'error',
        ]"
        :key="type"
        :type="type"
      >
        {{ type }}
      </n-text>
    </n-space>
    <n-space>
      <n-text strong>
        粗体
      </n-text><n-text italic>
        斜体
      </n-text><n-text underline>
        下划线
      </n-text><n-text delete>
        删除线
      </n-text><n-text code>
        代码
      </n-text>
    </n-space>
  </n-space>
</template>
