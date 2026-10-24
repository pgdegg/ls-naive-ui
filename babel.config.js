// 此文件用于站点构建及其他工具构建
// > 2%，使模板字符串不被编译为 concat，因为这样不快
const process = require('node:process')

module.exports = {
  presets:
    process.env.NODE_ENV === 'test'
      ? [['@babel/preset-env', { targets: { node: 'current' } }]]
      : [
          [
            '@babel/preset-env',
            {
              targets: '>2%, not IE 11'
            }
          ]
        ]
}
