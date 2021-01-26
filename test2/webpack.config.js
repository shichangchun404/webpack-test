const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry:  resolve(__dirname, "./app/main.js"),// 已多次提及的唯一入口文件
  output: {
    path: resolve(__dirname, "./public"), // 打包后的文件存放的地方 所有输出文件的目标路径;打包后文件在硬盘中的存储位置。
    filename: "[name].[hash:8].js", // 打包后输出文件的文件名 【入口文件名】+[hash值],
    // publicPath: '', 输出解析文件的目录，指定资源文件引用的目录 ，打包后浏览器访问服务时的 url 路径中通用的一部分。

  },
  // devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html', // 打包后文件
      template: 'app.html', // 模版页面文件
      inject: true // 是否插入打包bundle.js文件
    }),

  ],
  devServer: {
    contentBase: './public',  // 项目根路径
    hot: true,  // 开启热模替换功能
    inline: true, // 实时刷新
    host: 'localhost',
    port: '8081',
    open: true  // 自动打开浏览器
  },
  module: {  // 
    rules: [
      {
        oneOf: [
          {
            test: /\.(png|jpg|gif|svg)$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8 * 1024,  // 8kb大小以下的图片文件都用base64处理
                  name: 'images/[name].[hash:8].[ext]'
                }
              }
            ]
          },
          {
            loader: 'file-loader',
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: 'media/[name].[hash:8].[ext]',
            },
          }
        ]
      }
    ]
  },
}