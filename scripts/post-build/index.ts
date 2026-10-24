import { outDirs, replaceDefine, srcDir } from '../utils'
import { checkArtifacts } from './check-artifacts'
import { completePath } from './complete-path'
import { genWebTypes } from './gen-web-types'
import { terseCssr } from './terse-cssr'

;

(async () => {
  await terseCssr()
  await replaceDefine(outDirs, {
    __DEV__: 'process.env.NODE_ENV !== \'production\''
  })
  await replaceDefine([srcDir], {
    // 顺序至关重要
    '\'lodash\'': '\'lodash-es\''
  })

  // 补全 require 和 import 的源路径
  await completePath(['es'])

  // 为 webstorm & vetur 生成 web-types.json
  // web-types.json 只是对自动补全的非常宽松的描述
  // vscode 是一个更好的选择
  genWebTypes()

  // 如果 dts/output 中嵌入了宿主机文件系统路径，则使构建失败
  await checkArtifacts()
})()
