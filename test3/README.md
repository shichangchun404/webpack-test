### 多入口 多页面打包

### webpack的几种hash的区别
那么webpack打包也是如此，生产相应的版本号，具体的hash有三种
1、Hash
hash是跟整个项目的构建相关，构建生成的文件hash值都是一样的，所以hash计算是跟整个项目的构建相关，
同一次构建过程中生成的hash都是一样的，只要项目里有文件更改，整个项目构建的hash值都会更改。
如果出口是hash，那么一旦针对项目中任何一个文件的修改，都会构建整个项目，重新获取hash值，缓存的目的将失效。

2、chunkhash
采用hash计算的话，每一次构建后生成的hash值都不一样，即使文件内容压根没有改变。这样子是没办法实现缓存效果，我们需要另一种hash值计算方法，即chunkhash。
chunkhash和hash不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的hash值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成hash值，那么只要我们不改动公共库的代码，就可以保证其hash值不会受影响。
由于采用chunkhash，所以项目主入口文件main.js及其对应的依赖文件main.css由于被打包在同一个模块，所以共用相同的chunkhash，但是公共库由于是不同的模块，所以有单独的chunkhash。这样子就保证了在线上构建时只要文件内容没有更改就不会重复构建。
```
  entry: {
    page1: './app/html/page1/index.js',
    page2: './app/html/page2/index.js',
    p3: './app/html/page3/index.js',
  },
  output: {
    path: resolve(__dirname, "./dist"), // 打包后的文件存放的地方
    filename: "./js/[name].[chunkhash:8].js" // 打包后输出文件的文件名 
  },
```

chunkhash，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。
简单来说这种是根据不同入口来配置的，比如vue-router、vuex、vue等公共入口文件，只要这些没有改变，那么他对应生成的js的hash值也不会改变。

3、contenthash
contenthash主要是处理关联性，比如一个js文件中引入css，但是会生成一个js文件，一个css文件，但是因为入口是一个，导致他们的hash值也相同，所以当只有js修改时，关联输出的css、img等文件的hash值也会改变，这种情况下就需要contenthash了。
```
new MiniCssExtractPlugin({
  filename: 'css/[name].[contenthash:8].css',
  // chunkFilename: '[id].css',
}),
```
