const Router = require('koa-router')
const requireDirectory = require('require-directory')

class InitManager {
  //* 初始化核心方法
  static initCore(app) {
    // 入口方法
    InitManager.app = app
    InitManager.initLoadRouters()
    InitManager.loadHttpException()
    InitManager.loadConfig()
  }
  //* 加载配置文件
  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config
  }
  //* 初始化路由
  static initLoadRouters() {
    // 导入路径的所有模块
    const apiDir = `${process.cwd()}/app/api`;
    requireDirectory(module, apiDir, { visit: whenLoadModule })
    // 每当导入一个模块就会执行这个函数
    function whenLoadModule(obj) {
      // 判断自动加载的模块是否为路由类型
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }
  //* global加载异常处理方法
  static loadHttpException() {
    const errors = require('./http-exception')
    global.errs = errors
  }
}

module.exports = InitManager
