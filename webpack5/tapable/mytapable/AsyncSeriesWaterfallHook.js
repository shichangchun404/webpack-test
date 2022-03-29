class AsyncSeriesWaterfallHook{
  constructor(){
    this.tasks = []
  }
  tapAsync(name,task){
    this.tasks.push(task)
  }
  callAsync(data,callback){
    let index = 0
    const next = (error,data)=>{
      if(error){
        callback('遇到异常， 提前结束')
        return
      }
      if(index === this.tasks.length){
        callback('执行结束 '+data)
        return
      }
      this.tasks[index](data,next)
      index++
    }
    next(null,data)
  }
}

const test = ()=>{
  const hook = new AsyncSeriesWaterfallHook()
  hook.tapAsync('tapAsync',(data,next)=>{
    console.time('total time')
    console.log(1111,data)
    setTimeout(()=>{
      console.log('1111',data)
      next(null,'aaaa')
    },2000)
  })
  hook.tapAsync('tapAsync',(data,next)=>{
    console.log(2222,data)
    setTimeout(()=>{
      console.log('2222',data)
      next(null,'bbbb')
    },1000)
  })
  hook.tapAsync('tapAsync',(data,next)=>{
    console.log(3333,data)
    setTimeout(()=>{
      console.log('3333',data)
      next(null,'ccc')
    },3000)
  })

  hook.callAsync('hahah',(data)=>{
    console.log('=== callAsync end ===',data)
    console.timeEnd('total time')
  })
}
test()


module.exports = AsyncSeriesWaterfallHook