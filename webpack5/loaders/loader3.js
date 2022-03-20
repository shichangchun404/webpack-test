const {validate} = require('schema-utils')
const schema = require('./schema.json')

module.exports = function(content,map,meta){ // 不能用箭头函数 否则this={} 
  console.log(333)
  // 获取loader options参数
  const options = this.getOptions()
  console.log('options ', options)
  validate(schema,options,{
    name:'loader3'
  })
  
  return content
}

module.exports.pitch = ()=>{
  console.log('pitch 3')
}