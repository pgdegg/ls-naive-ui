import process from 'node:process'
import { defineConfig } from 'tsdown'
import vueJsxVapor from 'vue-jsx-vapor/rolldown'

const buildFormat = process.env.BUILD_FORMAT

if (buildFormat !== 'esm' && buildFormat !== 'cjs') {
  throw new Error('BUILD_FORMAT must be either "esm" or "cjs".')
}

const cjsLodashPlugin = {
  name: 'naive-cjs-lodash',
  renderChunk(code: string) {
    if (buildFormat !== 'cjs') {
      return null
    }
    return code
      .replaceAll('require("lodash-es")', 'require("lodash")')
      .replaceAll('require(\'lodash-es\')', 'require(\'lodash\')')
  }
}

export default defineConfig({
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.spec.*',
    '!src/vitest-setup.ts'
  ],
  root: 'src',
  outDir: buildFormat === 'esm' ? 'es' : 'lib',
  format: buildFormat,
  target: false,
  platform: 'browser',
  unbundle: true,
  dts: true,
  clean: false,
  outExtensions: () => ({
    js: '.js',
    dts: '.d.ts'
  }),
  deps: {
    // 编译后的 JSX 会引入 vue-jsx-vapor 的运行时辅助函数。它是
    // devDependency，因此将其加入白名单以打包进 es/lib；如果
    // node_modules 中的其他内容被打包，应使构建失败。
    onlyBundle: ['vue-jsx-vapor']
  },
  plugins: [
    cjsLodashPlugin,
    vueJsxVapor({
      interop: true
    })
  ],
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\''
  }
})
