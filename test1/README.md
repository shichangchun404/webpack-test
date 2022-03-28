## 初步正式使用Webpack 
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
```

# 测试项1 tree shaking
前提： 1. 必须使用ES6模块化 2.webpack配置文件中的mode开启production环境
注意：package.json文件添加sideEffects配置来实现哪些文件需要进行tree shaking。
"sideEffects":false 所有代码都可以进行tree shaking，css文件可能直接被删除。
"sideEffects':["*.css"] 即css文件不要进行tree shaking
