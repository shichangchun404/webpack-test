const {resolve} = require('path')
const copyrightWebackPlugin = require('./plugins/copyright-webpack-plugin.js')

module.exports = {
  mode:'none',
  entry:resolve(__dirname,'./app.js'),
  output:{
    path: resolve(__dirname,'./dist'),
    filename:'[name].js'
  },
  module:{
    rules:[
      {
        test:/\.md$/,
        use:resolve(__dirname,'./loader/md-loader.js') // 直接使用路径
      }
    ]
  },
  // devtool:"source-map"
  plugins:[
    new copyrightWebackPlugin({name:'shicc'})
  ]
}