const {validate} = require('schema-utils')
const schema = require('./schema-babel.json')
const babel = require('@babel/core') 
const util = require('util')

// 将babel.transform异步函数转成promise形式 
const transform = util.promisify(babel.transform)

module.exports = function(content){
  // 1 获取options
  const options = this.getOptions()
  // 2 校验参数
  validate(schema,options,{name:'babelLoader'})
  // 3 使用异步
  const callback = this.async()
  // 4 进行编译
  transform(content,options).then(({code,map})=>{
    callback(null,code,map)
  }).catch(e=>{
    callback(e)
  })

}