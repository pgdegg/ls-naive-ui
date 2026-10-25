<markdown>
# Basic usage and styles

Combine semantic colors and typography styles.
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
        Bold
      </n-text><n-text italic>
        Italic
      </n-text><n-text underline>
        Underline
      </n-text><n-text delete>
        Deleted
      </n-text><n-text code>
        Code
      </n-text>
    </n-space>
  </n-space>
</template>
