/**
 * 自定义wbepack
 * @returns 
 */
const path = require('path')
const fs = require('fs')
const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')

function myWebpack(options){
  return new Compiler(options)
}

class Compiler{
  constructor(options={}){
    this.options = options
  }
  // 启动webpack打包
  run(){
    // 1 获取入口文件
    let entryFilePath = this.options.entry
    console.log('entryFilePath = ', entryFilePath)
    // 读取入口文件内容
    let file = fs.readFileSync(entryFilePath,'utf-8')
    // console.log(file)

    // 2 将其解析成ast抽象语法树
    const ast = babelParser.parse(file,{
      sourceType:'module'
    })
    // console.log(ast)

    // 获取入口文件 文件夹路径
    let dirname = path.dirname(entryFilePath)
    console.log('dirname = ', dirname) // ./src

    // 创建依赖容器
    let deps = {}
    // 3 收集依赖
    traverse(ast,{
      // 内部遍历解析program.body 判断语句类型 如果是import导入语句 其type是ImportDeclaration 并触发对应函数
      ImportDeclaration(code){
        debugger
        // console.log(code)
        // 文件相对路径 如 './add.js'
        let relativePath = code.node.source.value
        // 基于入口文件 生成绝对路径
        let absolutionPath = path.resolve(dirname,relativePath)
        // 添加依赖
        deps[relativePath] = absolutionPath
      }
    })
    console.log('deps ', deps)

    // 4 编译代码 将浏览器不认识的语法进行编译
    let {code} = transformFromAst(ast,null,{
      presets:['@babel/preset-env']
    })
    console.log(code)
  }
}

module.exports = myWebpack