# 使用配置文件打包 默认读取项目根目录下webpack.config.js配置文件
> 执行命令 npm run dev 或者 npm run build
```bash
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
```

# 生成Source Maps（使调试更容易）
> 配置项 devtool: [source-map|cheap-module-source-map|eval-source-map|cheap-module-eval-source-map]

# 打包html文件 安装插件
npm install html-webpack-plugin --save-dev
```bash
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 打包后文件
      template: 'app.html', // 模版页面文件
      inject: true // 是否插入打包bundle.js文件
    }),
  ]
```

# 使用webpack构建本地服务器
> 配置项 devServer
安装依赖 npm install --save-dev webpack-dev-server
启动 npm run server 默认8080端口
可以在内存中自动打包所有类型文件并有自动编译运行、热更新等功能。此时磁盘中无文件生成 即public下无文件更新
```bash
  devServer: {
    contentBase: './dist',  // 项目根路径
    hot: true,  // 开启热模替换功能
    host: 'localhost',
    port: '8081',
    open: true  // 自动打开浏览器
  },
```

# loader
> 1 js语法检查 npm install eslint-loader eslint --save-dev
```bash
  配置loader
  module: {
    rules: [
      {
        test: /\.js$/,  // 只检测js文件
        exclude: /node_modules/,  // 排除node_modules文件夹
        enforce: "pre",  // 提前加载使用
        use: { // 使用eslint-loader解析
          loader: "eslint-loader" 
        }
      }        
    ]
  }

  #修改package.json（需要删除注释才能生效）
  "eslintConfig": {   //eslint配置
    "parserOptions": {  
      "ecmaVersion": 8,  // es8
      "sourceType": "module", //  ECMAScript 模块
    }
  }
```
> 2 js语法转换 npm install babel-loader @babel/core @babel/preset-env --save-dev
```bash
  配置loader
  module: {
  rules: [
    {
      oneOf: [  // 数组中的配置只有一个能够生效, 后面的配置都会放在当前数组中
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  ]
}
```
> 3 打包less资源 npm install css-loader style-loader less-loader less --save-dev
执行顺序从右向左 先将less转换css 再解析css 再将css放入style标签中
```bash
  oneOf: [
  {
    test: /\.less$/,
    use: [{
      loader: "style-loader"
    }, {
      loader: "css-loader" 
    }, {
      loader: "less-loader" 
    }]
  }
]
```
> 4 打包样式文件中的图片资源 npm install file-loader url-loader --save-dev
补充：url-loader是对象file-loader的上层封装，使用时需配合file-loader使用。
```bash
  {
    test: /\.(png|jpg|gif|svg)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          outputPath: 'images/',   // 在output基础上，修改输出图片文件的位置
          publicPath: 'images/',  //修改背景图引入url的路径
          limit: 8 * 1024,  // 8kb大小以下的图片文件都用base64处理
          name: '[hash:8].[ext]'  // hash值为8位，ext自动补全文件扩展名
        }
      }
    ]
  }
```

# 清除打包文件目录
> 安装插件 npm install clean-webpack-plugin --save-dev
```bash
  引入 const { CleanWebpackPlugin } = require('clean-webpack-plugin') 注意有{}
  plugins: [
    new CleanWebpackPlugin()
  ]
```