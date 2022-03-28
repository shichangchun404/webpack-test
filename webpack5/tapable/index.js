const { 
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require('tapable')

class Factory{
  constructor(){
    this.count = 1
    this.hooks = {
      syncHook: new SyncHook(),
      syncBailHook: new SyncBailHook(),
      syncWaterfallHook: new SyncWaterfallHook(['abc']),
      syncLoopHook: new SyncLoopHook(),
      asyncParallelHook: new AsyncParallelHook(['abc']),
      asyncParallelBailHook: new AsyncParallelBailHook(['arg1']),
      asyncSeriesHook: new AsyncSeriesHook(['abc']),
      asyncSeriesBailHook: new AsyncSeriesBailHook(['abc']),
      asyncSeriesWaterfallHook: new AsyncSeriesWaterfallHook(['abc'])
    }
  }
  tap(name){
     // 同步钩子
    this.hooks.syncHook.tap('syncHook1',()=>{
      console.log('syncHook1 ',name)
    })
    this.hooks.syncHook.tap('syncHook2',()=>{
      console.log('syncHook2 ',name)
    })
    // 同步保险钩子 返回undefined继续执行 否则停止向下执行
    this.hooks.syncBailHook.tap('syncBailHook1',()=>{
      console.log('syncBailHook1 ',name)
      
    })
    this.hooks.syncBailHook.tap('syncBailHook2',()=>{
      console.log('syncBailHook2 ',name)
      return 1
    })
    this.hooks.syncBailHook.tap('syncBailHook3',()=>{
      console.log('syncBailHook3 ',name)
    })
    // 同步瀑布流钩子 上次事件处理结构传给下次事件
    this.hooks.syncWaterfallHook.tap('syncWaterfallHook1',(data)=>{
      console.log('syncWaterfallHook1 ', data) // syncWaterfallHook1  scc-call
      return 1
    })
    this.hooks.syncWaterfallHook.tap('syncWaterfallHook2',(data)=>{
      console.log('syncWaterfallHook2 ', data) // syncWaterfallHook2  1
    })
    this.hooks.syncWaterfallHook.tap('syncWaterfallHook1',(data)=>{
      console.log('syncWaterfallHook3 ', data) // syncWaterfallHook3  1 此时data依旧是从第一个事件中return出来的
      console.log('syncWaterfallHook end')
    })
    // 同步循环钩子 直到return undefined 退出循环
    this.hooks.syncLoopHook.tap('syncLoopHook1',()=>{
      console.log('syncLoopHook 1 ', this.count) 
      this.count++
      if(this.count<3){
        return this.count
      }
    })
    this.hooks.syncLoopHook.tap('syncLoopHook2',(data)=>{
      console.log('syncLoopHook 2 ', data) 
    })

    // 异步并行钩子
    this.hooks.asyncParallelHook.tapAsync('asyncParallelHook',(name,cb)=>{
      console.time("total time"); // 记录起始时间
      console.log('asyncParallelHook 01',name) 
      setTimeout(function(){
        console.log('asyncParallelHook 1',name) 
        cb()
      },2000)
    })
    this.hooks.asyncParallelHook.tapAsync('asyncParallelHook',(name,cb)=>{
      console.log('asyncParallelHook 02', name) 
      setTimeout(function(){
        console.log('asyncParallelHook 2', name) 
        cb()
      },1000)
    })
    this.hooks.asyncParallelHook.tapAsync('asyncParallelHook',(name,cb)=>{
      console.log('asyncParallelHook 03', name) 
      setTimeout(function(){
        console.log('asyncParallelHook 3', name) 
        cb()
      },3000)
    })

    // 异步并行保险钩子 cb()中不是undefined 则直接调用callAsync的最终回调 后面的异步事件也会执行
    this.hooks.asyncParallelBailHook.tapAsync('AsyncParallelBailHook1',(name,cb)=>{
      console.time("total time"); // 记录起始时间
      console.log('AsyncParallelBailHook 01',name) 
      setTimeout(function(){
        console.log('AsyncParallelBailHook 1',name) 
        cb(null,111)
      },2000)
    })
    this.hooks.asyncParallelBailHook.tapAsync('AsyncParallelBailHook2',(name,cb)=>{
      console.log('AsyncParallelBailHook 02', name) 
      setTimeout(function(){
        console.log('AsyncParallelBailHook 2', name) 
        cb()
      },1000)
    })
    this.hooks.asyncParallelBailHook.tapAsync('AsyncParallelBailHook2',(name,cb)=>{
      console.log('AsyncParallelBailHook 03', name) 
      setTimeout(function(){
        console.log('AsyncParallelBailHook 3', name) 
        cb()
      },3000)
    })
    // AsyncParallelBailHook 01 scc-call
    // AsyncParallelBailHook 02 scc-call
    // AsyncParallelBailHook 03 scc-call
    // AsyncParallelBailHook 2 scc-call
    // AsyncParallelBailHook 1 scc-call
    // AsyncParallelBailHook end scc-call
    // AsyncParallelBailHook 3 scc-call // 仍然会运行完，只是已经不影响最终结果了

    // 异步串行钩子
    this.hooks.asyncSeriesHook.tapAsync('asyncSeriesHook',(name,cb)=>{
      console.time("total time"); // 记录起始时间
      console.log('asyncSeriesHook 01',name) 
      setTimeout(function(){
        console.log('asyncSeriesHook 1',name) 
        cb()
      },2000)
    })
    this.hooks.asyncSeriesHook.tapAsync('asyncSeriesHook',(name,cb)=>{
      console.log('asyncSeriesHook 02', name) 
      setTimeout(function(){
        console.log('asyncSeriesHook 2', name) 
        cb()
      },1000)
    })
    this.hooks.asyncSeriesHook.tapAsync('asyncSeriesHook',(name,cb)=>{
      console.log('asyncSeriesHook 03', name) 
      setTimeout(function(){
        console.log('asyncSeriesHook 3', name) 
        cb()
      },3000)
    })

    // 异步串行保险钩子
    /**
     * 中间任何一个任务返回不为undefined的值，终止执行，直接执行最后的回调，并且将这个返回值传给最终的回调
     * 这个执行结果跟AsyncParallelBailHook的区别就是AsyncSeriesBailHook被阻断后，后面的任务由于还没开始，所以可以被完全阻断，
     * 而AsyncParallelBailHook后面的任务由于已经开始了，所以还会继续执行，只是结果已经不关心了。
     */
    this.hooks.asyncSeriesBailHook.tapAsync('asyncSeriesBailHook',(name,cb)=>{
      console.time("total time"); // 记录起始时间
      console.log('asyncSeriesBailHook 01',name) 
      setTimeout(function(){
        console.log('asyncSeriesBailHook 1',name) 
        cb()
      },2000)
    })
    this.hooks.asyncSeriesBailHook.tapAsync('asyncSeriesBailHook',(name,cb)=>{
      console.log('asyncSeriesBailHook 02', name) 
      setTimeout(function(){
        console.log('asyncSeriesBailHook 2', name) 
        cb(111)
      },1000)
    })
    this.hooks.asyncSeriesBailHook.tapAsync('asyncSeriesBailHook',(name,cb)=>{
      console.log('asyncSeriesBailHook 03', name) 
      setTimeout(function(){
        console.log('asyncSeriesBailHook 3', name) 
        cb()
      },3000)
    })

    // asyncSeriesBailHook 01 scc-call
    // asyncSeriesBailHook 1 scc-call
    // asyncSeriesBailHook 02 scc-call
    // asyncSeriesBailHook 2 scc-call
    // asyncSeriesBailHook end scc-call
    // total time: 3014.203ms

    /**
     * 异步串行瀑布流钩子
     */
    this.hooks.asyncSeriesWaterfallHook.tapAsync('asyncSeriesWaterfallHook',(name,cb)=>{
      console.time("total time"); // 记录起始时间
      console.log('asyncSeriesWaterfallHook 01',name) 
      setTimeout(function(){
        console.log('asyncSeriesWaterfallHook 1',name) 
        cb(null,'aaaa')
      },2000)
    })
    this.hooks.asyncSeriesWaterfallHook.tapAsync('asyncSeriesWaterfallHook',(name,cb)=>{
      console.log('asyncSeriesWaterfallHook 02', name) 
      setTimeout(function(){
        console.log('asyncSeriesWaterfallHook 2', name) 
        cb(null,'bbb')
      },1000)
    })
    this.hooks.asyncSeriesWaterfallHook.tapAsync('asyncSeriesWaterfallHook',(name,cb)=>{
      console.log('asyncSeriesWaterfallHook 03', name) 
      setTimeout(function(){
        console.log('asyncSeriesWaterfallHook 3', name) 
        cb(null,'ccc')
      },3000)
    })
 
    // 异步并行钩子 Promise形式
    this.hooks.asyncParallelHook.tapPromise('asyncParallelHook',(name)=>{
      // console.time('total time')
      console.log('tapPromise asyncParallelHook 01', name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapPromise asyncParallelHook 1', name) 
          resolve()
        },2000)
      })
    })
    this.hooks.asyncParallelHook.tapPromise('asyncParallelHook',(name)=>{
      console.log('tapPromise asyncParallelHook 02', name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapPromise asyncParallelHook 2', name) 
          resolve()
        },1000)
      })
    })
    this.hooks.asyncParallelHook.tapPromise('asyncParallelHook',(name)=>{
      console.log('tapPromise asyncParallelHook 03', name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapPromise asyncParallelHook 3', name) 
          resolve()
        },3000)
      })
    })

    // 异步并行保险钩子 Promise形式
    this.hooks.asyncParallelBailHook.tapAsync('asyncParallelBailHook',(name)=>{
      console.log('tapAsync AsyncParallelBailHook 01',name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapAsync asyncParallelBailHook 1',name) 
          resolve(111)
        },2000)
      })
    })
    this.hooks.asyncParallelBailHook.tapAsync('asyncParallelBailHook',(name,cb)=>{
      console.log('tapAsync asyncParallelBailHook 02', name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapAsync asyncParallelBailHook 2',name) 
          resolve()
        },1000)
      })
    })
    this.hooks.asyncParallelBailHook.tapAsync('asyncParallelBailHook',(name,cb)=>{
      console.log('tapAsync asyncParallelBailHook 03', name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapAsync asyncParallelBailHook 3',name) 
          resolve()
        },3000)
      })
    })

    // 异步串行钩子 Promise形式 
    this.hooks.asyncSeriesHook.tapPromise('asyncSeriesHook',(name)=>{
      console.log('tapAsync asyncSeriesHook 01',name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapAsync asyncSeriesHook 1',name) 
          resolve()
        },2000)
      })
    })
    this.hooks.asyncSeriesHook.tapPromise('asyncSeriesHook',(name,cb)=>{
      console.log('tapAsync asyncSeriesHook 02', name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapAsync asyncSeriesHook 2',name) 
          resolve()
        },1000)
      })
    })
    this.hooks.asyncSeriesHook.tapPromise('asyncSeriesHook',(name,cb)=>{
      console.log('tapAsync asyncSeriesHook 03', name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapAsync asyncSeriesHook 3',name) 
          resolve()
        },3000)
      })
    })

    // 异步串行保险钩子 Promise形式 
    this.hooks.asyncSeriesBailHook.tapPromise('asyncSeriesBailHook',(name)=>{
      console.time("total time"); // 记录起始时间
      console.log('tapAsync asyncSeriesBailHook 01',name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapAsync asyncSeriesBailHook 1',name) 
          resolve()
        },2000)
      })
    })
    this.hooks.asyncSeriesBailHook.tapPromise('asyncSeriesBailHook',(name,cb)=>{
      console.log('tapAsync asyncSeriesBailHook 02', name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapAsync asyncSeriesBailHook 2',name) 
          // resolve()
          reject('reject')
        },1000)
      })
    })
    this.hooks.asyncSeriesBailHook.tapPromise('asyncSeriesBailHook',(name,cb)=>{
      console.log('tapAsync asyncSeriesBailHook 03', name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapAsync asyncSeriesBailHook 3',name) 
          resolve()
        },3000)
      })
    })

    // 异步串行瀑布流钩子 Promise形式 
    this.hooks.asyncSeriesWaterfallHook.tapPromise('asyncSeriesWaterfallHook',(name)=>{
      console.log('tapAsync asyncSeriesWaterfallHook 01',name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapAsync asyncSeriesWaterfallHook 1',name) 
          resolve('tapPromise 001')
        },2000)
      })
    })
    this.hooks.asyncSeriesWaterfallHook.tapPromise('asyncSeriesWaterfallHook',(name,cb)=>{
      console.log('tapAsync asyncSeriesWaterfallHook 02', name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapAsync asyncSeriesWaterfallHook 2',name) 
          resolve('tapPromise 002')
          // reject('reject')
        },1000)
      })
    })
    this.hooks.asyncSeriesWaterfallHook.tapPromise('asyncSeriesWaterfallHook',(name,cb)=>{
      console.log('tapAsync asyncSeriesWaterfallHook 03', name) 
      return new Promise((resolve,reject)=>{
        setTimeout(function(){
          console.log('tapAsync asyncSeriesWaterfallHook 3',name) 
          resolve('tapPromise 003')
        },3000)
      })
    })


    
  }
  call(name){
    this.hooks.syncHook.call(name)
    this.hooks.syncBailHook.call(name)
    this.hooks.syncWaterfallHook.call(name)
    this.hooks.syncLoopHook.call(name)

    // 异步回调风格
    // this.hooks.asyncParallelHook.callAsync(name, ()=>{
    //   console.log('asyncParallelHook end',name)
    //   console.timeEnd("total time"); // 记录总共耗时 total time: 3012.631ms
    // })
    // this.hooks.asyncParallelBailHook.callAsync(name, ()=>{
    //   console.log('AsyncParallelBailHook end',name)
    //   console.timeEnd("total time"); // 记录总共耗时
    // })
    // this.hooks.asyncSeriesHook.callAsync(name, ()=>{
    //   console.log('asyncSeriesHook end',name)
    //   console.timeEnd("total time"); // 记录总共耗时 total time: 6018.716ms
    // })
    // this.hooks.asyncSeriesBailHook.callAsync(name, ()=>{
    //   console.log('asyncSeriesBailHook end',name)
    //   console.timeEnd("total time"); 
    // })
    // this.hooks.asyncSeriesWaterfallHook.callAsync(name, ()=>{
    //   console.log('asyncSeriesWaterfallHook end',name)
    //   console.timeEnd("total time");
    // })

    // 异步Promise风格 此时会将tapAsync注册的asyncParallelHook钩子 也将执行
    // this.hooks.asyncParallelHook.promise(name).then(resolve=>{
    //   console.log('tapPromise asyncParallelHook end',name)
    //   console.timeEnd("total time"); 
    // })
    // this.hooks.asyncParallelBailHook.promise(name).then(resolve=>{
    //   console.log('tapPromise asyncParallelBailHook end',resolve)
    //   console.timeEnd("total time"); 
    // })
    // this.hooks.asyncSeriesHook.promise(name).then(resolve=>{
    //   console.log('tapPromise asyncParallelBailHook end',resolve)
    //   console.timeEnd("total time"); 
    // })
    // 同时会触发tapAsync注册的asyncSeriesBailHook钩子 并如果出现异常 会提前中断后续的执行
    // this.hooks.asyncSeriesBailHook.promise(name).then(resolve=>{
    //   console.log('tapPromise asyncParallelBailHook end',resolve)
    //   console.timeEnd("total time"); 
    // }).catch(error => {
    //   console.log('tapPromise asyncParallelBailHook error',error)
    //   console.timeEnd("total time"); 
    // })

    // this.hooks.asyncSeriesWaterfallHook.promise(name).then(resolve=>{
    //   console.log('tapPromise asyncSeriesWaterfallHook end',resolve)
    //   console.timeEnd("total time"); 
    // }).catch(error => {
    //   console.log('tapPromise asyncSeriesWaterfallHook error',error)
    //   console.timeEnd("total time"); 
    // })
    
    
  }
}

let factory = new Factory()
factory.tap('scc-tap')
factory.call('scc-call')

/**
  总结
  tapable是webpack实现plugin的核心库，他为webpack提供了多种事件处理和流程控制的Hook。
  这些Hook主要有同步(Sync)和异步(Async)两种，同时还提供了阻断(Bail)，瀑布(Waterfall)，循环(Loop)等流程控制，
  对于异步流程还提供了并行(Paralle)和串行(Series)两种控制方式。
  tapable其核心原理还是事件的发布订阅模式，他使用tap来注册事件，使用call来触发事件。
  异步hook支持两种写法：回调和Promise，注册和触发事件分别使用tapAsync/callAsync和tapPromise/promise。
  异步hook使用回调写法的时候要注意，回调函数的第一个参数默认是错误，第二个参数才是向外传递的数据，这也符合node回调的风格。
  使用promise触发事件还是callAsync触发运行的结果都是一样的，所以tapable内部应该是做了兼容转换的
 */