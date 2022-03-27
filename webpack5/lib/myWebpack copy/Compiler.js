 const { getAst, getDeps, getCodeFromAst} = require('./parser')
 
 class Compiler{
    constructor(options={}){
      this.options = options
    }
    // 启动webpack打包
    run(){
      // 1 获取入口文件
      let filePath = this.options.entry
      // 2 获取AST抽象语法树
      let ast = getAst(filePath)
      // 3 根据AST收集依赖
      let deps = getDeps(filePath,ast)
      // 4 将AST编译成code
      let code = getCodeFromAst(ast)
      console.log(ast)
      console.log(deps)
      console.log(code)
    }
 }
 
 module.exports = Compiler