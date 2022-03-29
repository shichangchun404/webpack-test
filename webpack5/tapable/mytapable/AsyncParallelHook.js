class AsyncParallelHook{
  constructor(){
    this.tasks = []
  }
  tapAsync(name,task){
    this.tasks.push(task)
  }
  callAsync(name,callback){
    let index = 0
    const next = ()=>{
      console.log('=== next', index)
      if(index == this.tasks.length-1){
        callback(null,'执行完毕')
      }
      index++
    }
    this.tasks.forEach(item => {
      item(name,next)
    })
  }
  tapPromise(name,task){
    this.tasks.push(task)
  }
  promise(data){
    let promiseList = this.tasks.map(item => {
      return item(data)
    })
    return Promise.all(promiseList)
  }
}

const test = ()=>{
  const hook = new AsyncParallelHook()
  hook.tapAsync('tapAsync',(name,cb)=>{
    console.time('total time')
    console.log(1111,name)
    setTimeout(()=>{
      console.log(1111,1111)
      cb()
    },2000)
  })
  hook.tapAsync('tapAsync',(name,cb)=>{
    console.log(2222,name)
    setTimeout(()=>{
      console.log(2222,2222)
      cb()
    },1000)
  })
  hook.tapAsync('tapAsync',(name,cb)=>{
    console.log(3333,name)
    setTimeout(()=>{
      console.log(3333,3333)
      cb()
    },3000)
  })
  hook.callAsync('hahahha',(error,data)=>{
    console.log('callAsync end',error,data)
    console.timeEnd('total time')
  })
}

const test2 = ()=> {
  const hook = new AsyncParallelHook()
  hook.tapPromise('tapPromise',(data)=>{
    console.time('total time')
    return new Promise((resolve,reject)=>{
      console.log(1111)
      setTimeout(()=>{
        console.log('1111')
        resolve()
      },2000)
    })
  })
  hook.tapPromise('tapPromise',(data)=>{
    return new Promise((resolve,reject)=>{
      console.log(2222)
      setTimeout(()=>{
        console.log('2222')
        resolve()
        // reject()
      },1000)
    })
  })
  hook.tapPromise('tapPromise',(data)=>{
    return new Promise((resolve,reject)=>{
      console.log(3333)
      setTimeout(()=>{
        console.log('3333')
        resolve()
      },3000)
    })
  })
  hook.promise('heeh').then(resolve=>{
    console.log('=== promise end === ',resolve)
    console.timeEnd('total time')
  }).catch(error => {
    console.log('=== promise error === ',error)
    console.timeEnd('total time')
  })
}

// test()
test2()

module.exports = AsyncParallelHook