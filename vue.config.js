'use strict'
const path = require('path')

const resolve = (dir) => path.resolve(__dirname, dir)

function chainWebpack(config) {
  // set svg-sprite-loader
  config.module
    .rule('svg') // 在已有的svg loader配置中 排除掉对src/icons里svg进行转换
    .exclude
    .add(resolve('src/icons'))
    .end()
  config.module
    .rule('icons')
    .test(/\.svg$/)
    .include.add(resolve('src/icons'))
    .end()
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'icon-[name]'
    })
    .end()
}

module.exports = {
  chainWebpack
}
