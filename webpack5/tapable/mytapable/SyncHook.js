class SyncHook {
  constructor(){
    this.tasks = []
  }
  tap(name,task){
    this.tasks.push(task)
  }
  call(name){
    this.tasks.forEach(item => {
      item(name)
    })
  }
}

const test = ()=>{
  const hook = new SyncHook()
  hook.tap('tap1',(name)=>{
    console.log('tap1',name)
  })
  hook.tap('tap2',(name)=>{
    console.log('tap2',name)
  })
  hook.call('hahha')
}

test()


module.exports = SyncHook