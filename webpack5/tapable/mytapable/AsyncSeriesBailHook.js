class AsyncSeriesBailHook{
  constructor(){
    this.tasks = []
  }
  tapAsync(name,task){
    this.tasks.push(task)
  }
  callAsync(data,callback){
    let index = 0
    const next = (data)=>{
      if(index === this.tasks.length||data!=undefined){
        callback('执行终止')
        return
      }
      this.tasks[index](undefined,next)
      index++
    }
    next()
  }
}

const test = ()=>{
  const hook = new AsyncSeriesBailHook()
  hook.tapAsync('tapAsync',(data,next)=>{
    console.time('total time')
    console.log(1111)
    setTimeout(()=>{
      console.log('1111')
      next(data)
    },2000)
  })
  hook.tapAsync('tapAsync',(data,next)=>{
    console.log(2222)
    setTimeout(()=>{
      console.log('2222')
      next(111)
    },1000)
  })
  hook.tapAsync('tapAsync',(data,next)=>{
    console.log(3333)
    setTimeout(()=>{
      console.log('333')
      next(data)
    },3000)
  })
  hook.callAsync('ahaah',(data)=>{
    console.log('=== callAsync end ',data)
    console.timeEnd('total time')
  })
}

test()

module.exports = AsyncSeriesBailHook