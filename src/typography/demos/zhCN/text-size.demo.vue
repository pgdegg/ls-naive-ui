<markdown>
# 字号

显式选择主题字号，或省略 size 继承父级。
</markdown>

<template>
  <n-space vertical>
    <n-space align="baseline">
      <n-text size="small">
        小号文本
      </n-text>
      <n-text size="medium">
        中号文本
      </n-text>
      <n-text size="large">
        大号文本
      </n-text>
    </n-space>
    <div style="font-size: 24px">
      <n-text>继承父级 24px 字号</n-text>
    </div>
  </n-space>
</template>
