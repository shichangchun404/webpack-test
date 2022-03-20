const {resolve} = require('path')

module.exports = {
  mode: "production",
  // entry:'./src/index.js' // 默认entry

  // loader函数会从下往往上的顺序执行 但是loader中的pitch函数会从上往下执行 
  module: {
    rules:[
      {
        test:/\.js$/,
        use:[
          {
            loader: 'loader3',
            options:{
              name:'scc',
              age: 30
            }
          },
          'loader2',
          'loader1',
        ]
      }
    ]
  },

  // 配置loader路径
  resolveLoader:{
    modules: ['node_modules', resolve(__dirname,'loaders')]
  }
    
}