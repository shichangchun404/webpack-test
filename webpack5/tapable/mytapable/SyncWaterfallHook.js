class SyncWaterfallHook{
  constructor(){
    this.tasks = []
  }
  tap(name,task){
    this.tasks.push(task)
  }
  call(name){
    this.tasks.reduce((result,current)=>{
      let newResult = current(result)
      return newResult?newResult:result // 其中某个事件没有返回值 拿上一个传递下去
    },name)
  }
}

const test = ()=>{
  const hook = new SyncWaterfallHook()
  hook.tap('tap',(name)=>{
    console.log(1111,name)
    return 1
  })
  hook.tap('tap',(name)=>{
    console.log(2222,name)
    return name + 100
  })
  hook.tap('tap',(name)=>{
    console.log(3333,name)
  })
  hook.tap('tap',(name)=>{
    console.log(444,name)
  })
  hook.call('heihei')
}

test()

module.exports = SyncWaterfallHook