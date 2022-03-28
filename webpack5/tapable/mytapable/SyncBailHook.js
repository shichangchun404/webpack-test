class SyncBailHook{
  constructor(){
    this.tasks = []
  }
  tap(name,task){
    this.tasks.push(task)
  }
  call(name){
    let index = 0
    let result = undefined
    while(result === undefined && index<this.tasks.length){
      result = this.tasks[index](name)
      index++
    }
  }
}
const test = ()=> {
  const hook = new SyncBailHook()
  hook.tap('tap',(name)=>{
    console.log(1111,name)
  })
  hook.tap('tap',(name)=>{
    console.log(2222,name)
    return 11
  })
  hook.tap('tap',(name)=>{
    console.log(3333,name)
  })
  hook.call('hahah')
}

test()


export default SyncBailHook