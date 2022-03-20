/**
 * loader1
 * @param {*} content 
 * @param {*} map 
 * @param {*} meta 
 * @returns 
 */

// 同步loader
module.exports = function(content,map,meta){
  console.log('content,map,meta',content,map,meta)
  console.log(111)
  // return content
  this.callback(null,content,map,meta) // 同上
}

module.exports.pitch = function(){
  console.log('pitch 1')
}