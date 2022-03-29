class AsyncSeriesHook{
  constructor(){
    this.tasks = []
  }
  tapAsync(name,task){
    this.tasks.push(task)
  }
  callAsync(data,callback){
    let index = 0
    const next = ()=>{
      if(index===this.tasks.length){
        callback('执行结束')
        return
      }
      this.tasks[index](null,next)
      index++
    }
    next()
  }
  tapPromise(name,task){
    this.tasks.push(task)
  }
  promise(data){
    return new Promise(async (resolve)=>{
      // this.tasks.forEach(async (item)=>{ // 不能用forEach 它是异步执行
      //   await item()
      // })
      for(let i=0;i<this.tasks.length;i++){
        await this.tasks[i]()
      }
      resolve()
    })
  }
}

const test = ()=>{
  const hook = new AsyncSeriesHook()
  hook.tapAsync('tapAsync',(data,next)=>{
    console.time('total time')
    console.log(1111)
    setTimeout(()=>{
      console.log('1111')
      next()
    },2000)
  })
  hook.tapAsync('tapAsync',(data,next)=>{
    console.log(2222)
    setTimeout(()=>{
      console.log('2222')
      next()
    },1000)
  })
  hook.tapAsync('tapAsync',(data,next)=>{
    console.log(3333)
    setTimeout(()=>{
      console.log('3333')
      next()
    },3000)
  })
  hook.callAsync('heheh',(data)=>{
    console.log('=== callAsync end === ',data)
    console.timeEnd('total time')
  })
}

const test2 = ()=>{
  const hook = new AsyncSeriesHook()
  hook.tapPromise('tapPromise',data=>{
    return new Promise((resolve,reject)=>{
      console.time('total time')
      console.log(1111)
      setTimeout(()=>{
        console.log('1111')
        resolve()
      },2000)
    })
  })
  hook.tapPromise('tapPromise',data=>{
    return new Promise((resolve,reject)=>{
      console.log(2222)
      setTimeout(()=>{
        console.log('2222')
        resolve()
      },1000)
    })
  })
  hook.tapPromise('tapPromise',data=>{
    return new Promise((resolve,reject)=>{
      console.log(3333)
      setTimeout(()=>{
        console.log('3333')
        resolve()
      },3000)
    })
  })
  hook.promise('hahaa').then(value=>{
    console.log('=== promise end === ',value)
    console.timeEnd('total time')
  }).catch(error => {
    console.log('=== promise error === ',error)
    console.timeEnd('total time')
  })
}

// test()
test2()

module.exports = AsyncSeriesHook