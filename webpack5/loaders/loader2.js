
// 异步loader
module.exports = function(content,map,meta){
  console.log(222)
  const callback = this.async() // callback调用后 后面的loader才会执行
  setTimeout(function(){
    console.log('异步loader 222')
    callback(null,content)
  },1000)
}

module.exports.pitch = function(){
  console.log('pitch 2')
}