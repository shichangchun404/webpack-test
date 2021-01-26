const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  devServer: { // webpack-dev-server --open --port 8888 --contentBase src --hot
    open: true,
    port: 9999,
    contentBase: 'src',
    hot: true // 仅仅此处配置不行 还需添加HotModuleReplacementPlugin插件
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 
  ]
}