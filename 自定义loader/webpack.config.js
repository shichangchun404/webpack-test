const {resolve} = require('path')

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
}