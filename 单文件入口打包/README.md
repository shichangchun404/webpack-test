# 1 无配置文件时 使用命令行参数启动
> webpack可以在终端中使用，在基本的使用方法如下：
```bash
  # {extry file}出填写入口文件的路径，本文中就是上述main.js的路径，
  # {destination for bundled file}处填写打包文件的存放路径
  # 填写路径的时候不用添加{}
  # 低版本
  webpack {entry file} {destination for bundled file}
  # 高版本 4+ mode不指定默认是production
  webpack {entry file} -o {destination for bundled file} --mode [development|production|none]
  # webpack非全局安装的情况 高版本4
  node_modules/.bin/webpack app/main.js -o public/bundle.js --mode development
  例子如下
  "scripts": {
    "test": "webpack app/main.js -o public/bundle.js",
    "dev": "webpack app/main.js -o public/bundle.dev.js --mode development",
    "build": "webpack app/main.js -o public/bundle.prod.js --mode production"
  },
```

# 2 使用配置文件打包 默认读取项目根目录下webpack.config.js配置文件
> 执行命令 npm run dev 或者 npm run build
```bash
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
```
# 3 配置文件基本配置
## 生成Source Maps（使调试更容易）
> 配置项 devtool: [source-map|cheap-module-source-map|eval-source-map|cheap-module-eval-source-map]

## 打包html文件 安装插件
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

## 使用webpack构建本地服务器
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

## loader
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

## 清除打包文件目录
> 安装插件 npm install clean-webpack-plugin --save-dev
```bash
  引入 const { CleanWebpackPlugin } = require('clean-webpack-plugin') 注意有{}
  plugins: [
    new CleanWebpackPlugin()
  ]
```

# 4 webpack打包优化

## 4.1 tree shaking
前提： 1. 必须使用ES6模块化 2.webpack配置文件中的mode开启production环境
注意：package.json文件添加sideEffects配置来实现哪些文件需要进行tree shaking。
"sideEffects":false 所有代码都可以进行tree shaking，css文件可能直接被删除。
"sideEffects':["*.css"] 即css文件不要进行tree shaking