const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    page1: './app/html/page1/index.js',
    page2: './app/html/page2/index.js',
  },
  output: {
    path: resolve(__dirname, "./dist"), // 打包后的文件存放的地方
    filename: "./js/[name].[hash:8].js" // 打包后输出文件的文件名 【入口文件名】+[hash值],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // style-loader创建style标签 css-loader 让webpack识别css文件
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'page1.html', // 打包后文件
      template: 'app/html/page1/index.html', // 模版页面文件
      inject: true, // 是否插入打包bundle.js文件
      chunks: ['page1']
    }),
    new HtmlWebpackPlugin({
      filename: 'page2.html', // 打包后文件
      template: 'app/html/page2/index.html', // 模版页面文件
      inject: true, // 是否插入打包bundle.js文件
      chunks: ['page2']
    }),
  ],
  devServer: {
    contentBase: './dist',  // 项目根路径
    hot: true,  // 开启热模替换功能
    inline: true, // 实时刷新
    host: 'localhost',
    port: '8082',
    open: true  // 自动打开浏览器
  },
  resolve: {
    // 自动补全后缀，注意第一个必须是空字符串,后缀一定以点开头
    extensions: [" ",".js",".css",".json"],
    // 使用绝对路径指明第三方目录，减少搜索步骤    
    modules: [resolve(__dirname, 'node_modules')],
    // 别名配置
    alias: {
      "@": resolve(__dirname, "app")
    }
  }
}
