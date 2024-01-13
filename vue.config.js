const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  productionSourceMap: false, // false 表示关闭
  devServer: {
    proxy: {
      '/v1': {
        target: 'https://api.replicate.com',
        changeOrigin: true,
        pathRewrite: {
          '^/v1': '/v1'
        }
      }
    }
  }
})