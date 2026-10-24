// 此文件由 vite 使用，请保留在这里
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: [
        'default',
        {
          normalizeWhitespace: false,
          colormin: false
        }
      ]
    })
  ]
}
