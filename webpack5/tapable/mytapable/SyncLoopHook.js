class SyncLoopHook{
  constructor(){
    this.tasks = []
  }
  tap(name,task){
    this.tasks.push(task)
  }
  call(name){
    let index = 0
    let result = ''
    do{
      result = this.tasks[index]()
      if(result===undefined){
        index++
      }
    }while(index<this.tasks.length)
  }
}

const test = ()=>{
  const hook = new SyncLoopHook()
  hook.tap('tap',(name)=>{
    console.log(1111,name)
  })
  hook.tap('tap',(name)=>{
    let num = Math.floor(Math.random()*10)
    console.log(num,' 小于4时退出循环')
    return num<4?undefined:num
  })
  hook.tap('tap',(name)=>{
    console.log(333,name)
  })
  hook.call()
}

test()

module.exports = SyncLoopHook