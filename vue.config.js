const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  productionSourceMap: false, // false 表示关闭
  devServer: {
    proxy: {
      '/api': {
        target: 'https://waveformer.replicate.dev',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
})