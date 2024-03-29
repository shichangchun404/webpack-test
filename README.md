# webpack-test
webpack学习笔记
## 什么是webpack
Webpack是一个模块打包器(bundler)。
在Webpack看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理
它将根据模块的依赖关系进行静态分析，生成对应的静态资源

## 五个核心概念
Entry：入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。
Output：output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。
Loader：loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只能解析 JavaScript）。
Plugins：插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等。
Mode：模式，有生产模式production和开发模式development

## 理解Loader
Webpack 本身只能加载JS/JSON模块，如果要加载其他类型的文件(模块)，就需要使用对应的loader 进行转换/加载
Loader 本身也是运行在 node.js 环境中的 JavaScript 模块
它本身是一个函数，接受源文件作为参数，返回转换的结果
loader 一般以 xxx-loader 的方式命名，xxx 代表了这个 loader 要做的转换功能，比如 json-loader。

## 理解Plugins
插件可以完成一些loader不能完成的功能。
插件的使用一般是在 webpack 的配置信息 plugins 选项中指定。
配置文件(默认)

webpack.config.js : 是一个node模块，返回一个 json 格式的配置信息对象