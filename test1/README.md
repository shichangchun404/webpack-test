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
