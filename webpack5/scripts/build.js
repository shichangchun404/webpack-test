const myWebpack = require("../lib/myWebpack/index");
const config = require("../webpack.config");

const compiler = new myWebpack(config)
compiler.run()