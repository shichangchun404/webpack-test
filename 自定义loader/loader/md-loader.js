module.exports = source =>{
  // 加载的模块内容
  console.log('source ', source)
  // 返回值是最终打包的内容 需要返回一段可执行的js代码 
  //return '你好' // ReferenceError: 你好 is not defined
  // return "console.log('你好')"
  let code = `export default {source:${JSON.stringify(source)}}` 
  return code
}